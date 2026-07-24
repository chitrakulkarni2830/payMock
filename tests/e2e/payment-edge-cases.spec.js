import { test, expect } from "@playwright/test";

test.describe("PayMock E2E Payment Edge Cases & Stability", () => {
  test("Validation: rejects empty UPI ID submission", async ({ page }) => {
    await page.goto("/checkout");
    const postPaymentPromise = page.waitForResponse(
      (res) => res.url().includes("/api/payments") && res.request().method() === "POST"
    );
    await page.getByRole("button", { name: /Continue to Payment/i }).click();
    const postResponse = await postPaymentPromise;
    const { data } = await postResponse.json();

    await expect(page).toHaveURL(new RegExp(`/payment/${data.paymentId}`));

    // Clear UPI input if any and try paying
    const upiInput = page.getByPlaceholder("yourname@upi");
    await upiInput.fill("");

    // Click Pay button
    await page.getByRole("button", { name: /Pay ₹499/i }).click();

    // Expect inline validation error message to be visible on the payment form
    await expect(page.getByText(/UPI ID is required/i)).toBeVisible();
  });

  test("Page Refresh Stability: Refreshing payment pages never triggers a new POST /api/payments", async ({
    page,
  }) => {
    let postCallCount = 0;
    page.on("request", (req) => {
      if (req.url().endsWith("/api/payments") && req.method() === "POST") {
        postCallCount++;
      }
    });

    await page.goto("/checkout");
    await page.getByRole("button", { name: /Continue to Payment/i }).click();
    await page.waitForURL(/\/payment\//);

    expect(postCallCount).toBe(1);

    // Refresh Payment page
    await page.reload();
    await expect(page.getByRole("heading", { name: "Complete Payment" })).toBeVisible();

    // Confirm no additional POST request occurred
    expect(postCallCount).toBe(1);
  });

  test("Duplicate Processing Guard: Processing an already completed payment returns 400 Bad Request", async ({
    page,
    request,
  }) => {
    // Create payment
    const createRes = await request.post("http://localhost:5001/api/payments", {
      data: {
        merchantName: "PayMock Store",
        customerName: "Demo Customer",
        amount: 499,
        paymentMethod: "UPI",
      },
    });
    const createBody = await createRes.json();
    const paymentId = createBody.data.paymentId;

    // Process payment first time -> Success
    const processRes1 = await request.post(
      `http://localhost:5001/api/payments/${paymentId}/process`,
      {
        data: { paymentMethod: "UPI", upiId: "user@upi" },
      }
    );
    expect(processRes1.status()).toBe(200);

    // Process payment second time -> Should fail with 400
    const processRes2 = await request.post(
      `http://localhost:5001/api/payments/${paymentId}/process`,
      {
        data: { paymentMethod: "UPI", upiId: "user@upi" },
      }
    );
    expect(processRes2.status()).toBe(400);
    const body2 = await processRes2.json();
    expect(body2.success).toBe(false);
    expect(body2.message).toContain("Payment is already Success");
  });

  test("Validation: rejects invalid card expiry date like 77/77 on UI and API", async ({
    page,
    request,
  }) => {
    // 1. UI Check: Fill 77/77 and ensure error message appears
    await page.goto("/checkout");
    await page.getByRole("button", { name: /Continue to Payment/i }).click();
    await page.waitForURL(/\/payment\//);

    const cardMethodBtn = page.getByRole("button", { name: /Card Debit or credit card/i });
    await cardMethodBtn.click();

    await page.getByPlaceholder("1234 5678 9012 3456").fill("4111 1111 1111 1111");
    await page.getByPlaceholder("John Doe").fill("Demo Customer");
    await page.getByPlaceholder("MM/YY").fill("77/77");
    await page.getByPlaceholder("•••").fill("123");

    await page.getByRole("button", { name: /Pay ₹499/i }).click();

    // Expect inline validation error message to be visible
    await expect(page.getByText(/Invalid expiry/i)).toBeVisible();

    // 2. API Backend Check: Send process call with 77/77 directly
    const createRes = await request.post("http://localhost:5001/api/payments", {
      data: {
        merchantName: "PayMock Store",
        customerName: "Demo Customer",
        amount: 499,
        paymentMethod: "Card",
      },
    });
    const { data } = await createRes.json();

    const badApiRes = await request.post(
      `http://localhost:5001/api/payments/${data.paymentId}/process`,
      {
        data: {
          paymentMethod: "Card",
          cardNumber: "4111111111111111",
          cardHolderName: "Demo Customer",
          expiry: "77/77",
          cvv: "123",
        },
      }
    );

    expect(badApiRes.status()).toBe(400);
    const badApiBody = await badApiRes.json();
    expect(badApiBody.success).toBe(false);
    expect(badApiBody.message).toContain("Invalid or expired card expiry date");
  });
});
