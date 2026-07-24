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

    // Expect navigation to failed page or error handling
    await expect(page).toHaveURL(new RegExp(`/failed/${data.paymentId}`));
    await expect(page.getByRole("heading", { name: "Payment Failed" })).toBeVisible();
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
});
