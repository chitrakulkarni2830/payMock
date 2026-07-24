import { test, expect } from "@playwright/test";

test.describe("PayMock E2E Payment Flow — UPI Method", () => {
  test("Completes end-to-end UPI payment flow with full network & UI validation", async ({
    page,
  }) => {
    let createdPaymentId = "";

    // ─────────────────────────────────────────────────────────────
    // STEP 1: Checkout Page
    // ─────────────────────────────────────────────────────────────
    await page.goto("/");
    await expect(page).toHaveURL(/\/checkout/);

    // Verify UI Order Details
    await expect(page.getByRole("heading", { name: "PayMock Store" })).toBeVisible();
    await expect(page.getByText("ORD-2024-7829")).toBeVisible();
    await expect(page.getByText("499").first()).toBeVisible();
    await expect(page.getByText("Premium Plan")).toBeVisible();

    // Capture Checkout Screenshot
    await page.screenshot({
      path: "assets/checkout.png",
      fullPage: true,
    });

    // Intercept POST /api/payments request
    const postPaymentPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/payments") &&
        response.request().method() === "POST"
    );

    // Click Continue to Payment
    const continueBtn = page.getByRole("button", { name: /Continue to Payment/i });
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    // Validate POST /api/payments Request & Response
    const postPaymentResponse = await postPaymentPromise;
    expect(postPaymentResponse.status()).toBe(201);

    const postResponseBody = await postPaymentResponse.json();
    expect(postResponseBody.success).toBe(true);
    expect(postResponseBody.data).toHaveProperty("paymentId");
    expect(postResponseBody.data.status).toBe("Pending");
    expect(postResponseBody.data.amount).toBe(499);
    expect(postResponseBody.data.merchantName).toBe("PayMock Store");

    createdPaymentId = postResponseBody.data.paymentId;
    expect(createdPaymentId).toBeTruthy();

    // ─────────────────────────────────────────────────────────────
    // STEP 2: Payment Page
    // ─────────────────────────────────────────────────────────────
    await expect(page).toHaveURL(new RegExp(`/payment/${createdPaymentId}`));

    // Verify Payment Page UI
    await expect(page.getByRole("heading", { name: "Complete Payment" })).toBeVisible();
    await expect(page.getByText("PayMock Store")).toBeVisible();

    // Capture Payment Page Screenshot
    await page.screenshot({
      path: "assets/payment_page.png",
      fullPage: true,
    });

    // Fill UPI ID
    const upiInput = page.getByPlaceholder("yourname@upi");
    await expect(upiInput).toBeVisible();
    await upiInput.fill("testcustomer@okaxis");

    // Intercept POST /api/payments/:paymentId/process
    const processPaymentPromise = page.waitForResponse(
      (response) =>
        response.url().includes(`/api/payments/${createdPaymentId}/process`) &&
        response.request().method() === "POST"
    );

    // Click Pay Button
    const payBtn = page.getByRole("button", { name: /Pay ₹499/i });
    await expect(payBtn).toBeEnabled();
    await payBtn.click();

    // Validate POST /api/payments/:paymentId/process Request & Response
    const processResponse = await processPaymentPromise;
    expect(processResponse.status()).toBe(200);

    const processResponseBody = await processResponse.json();
    expect(processResponseBody.success).toBe(true);
    expect(processResponseBody.data.paymentId).toBe(createdPaymentId);
    expect(processResponseBody.data.status).toBe("Success");
    expect(processResponseBody.data.paymentMethod).toBe("UPI");

    // ─────────────────────────────────────────────────────────────
    // STEP 3: Processing Page
    // ─────────────────────────────────────────────────────────────
    await expect(page).toHaveURL(new RegExp(`/processing/${createdPaymentId}`));
    await expect(page.getByRole("heading", { name: "Processing Payment" })).toBeVisible();
    await expect(
      page.getByText("Please wait while we securely process your payment")
    ).toBeVisible();
    await expect(page.getByText(createdPaymentId)).toBeVisible();

    // Capture Processing Page Screenshot
    await page.screenshot({
      path: "assets/processing.png",
      fullPage: true,
    });

    // ─────────────────────────────────────────────────────────────
    // STEP 4: Success Page
    // ─────────────────────────────────────────────────────────────
    await expect(page).toHaveURL(new RegExp(`/success/${createdPaymentId}`), {
      timeout: 10000,
    });
    await expect(page.getByRole("heading", { name: "Payment Successful" })).toBeVisible();
    await expect(
      page.getByText("Your payment has been processed successfully.")
    ).toBeVisible();
    await expect(page.getByText(createdPaymentId)).toBeVisible();

    // Capture Success Page Screenshot
    await page.screenshot({
      path: "assets/success.png",
      fullPage: true,
    });

    // Navigate to Payment Details
    const detailsBtn = page.getByRole("button", { name: /View Payment Details/i });
    await detailsBtn.click();

    // ─────────────────────────────────────────────────────────────
    // STEP 5: Payment Details Page
    // ─────────────────────────────────────────────────────────────
    await expect(page).toHaveURL(new RegExp(`/payment-details/${createdPaymentId}`));
    await expect(page.getByRole("heading", { name: "Payment Details" })).toBeVisible();
    await expect(page.getByText(createdPaymentId)).toBeVisible();
    await expect(page.getByText("PayMock Store")).toBeVisible();
    await expect(page.getByText("Demo Customer")).toBeVisible();
    await expect(page.getByText("₹499")).toBeVisible();
    await expect(page.getByText("INR")).toBeVisible();
    await expect(page.getByText("UPI")).toBeVisible();

    // Capture Payment Details Screenshot
    await page.screenshot({
      path: "assets/payment_details.png",
      fullPage: true,
    });
  });
});
