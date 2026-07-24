import { test, expect } from "@playwright/test";

test.describe("PayMock E2E Payment Flow — Card Method", () => {
  test("Completes end-to-end Card payment flow with full network & UI validation", async ({
    page,
  }) => {
    let createdPaymentId = "";

    // Step 1: Checkout
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/checkout/);

    const postPaymentPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/payments") &&
        response.request().method() === "POST"
    );

    await page.getByRole("button", { name: /Continue to Payment/i }).click();

    const postPaymentResponse = await postPaymentPromise;
    const postResponseBody = await postPaymentResponse.json();
    createdPaymentId = postResponseBody.data.paymentId;

    // Step 2: Payment Selection - Switch to Card
    await expect(page).toHaveURL(new RegExp(`/payment/${createdPaymentId}`));

    // Click Card payment method button in selector
    const cardMethodBtn = page.getByRole("button", { name: /Card Debit or credit card/i });
    await cardMethodBtn.click();

    // Fill Card Form
    await page.getByPlaceholder("1234 5678 9012 3456").fill("4111 1111 1111 1111");
    await page.getByPlaceholder("John Doe").fill("Demo Customer");
    await page.getByPlaceholder("MM/YY").fill("12/28");
    await page.getByPlaceholder("•••").fill("123");

    // Intercept Process Request
    const processPaymentPromise = page.waitForResponse(
      (response) =>
        response.url().includes(`/api/payments/${createdPaymentId}/process`) &&
        response.request().method() === "POST"
    );

    // Click Pay Button
    await page.getByRole("button", { name: /Pay ₹499/i }).click();

    const processResponse = await processPaymentPromise;
    expect(processResponse.status()).toBe(200);
    const processResponseBody = await processResponse.json();
    expect(processResponseBody.data.paymentMethod).toBe("Card");

    // Step 3: Processing
    await expect(page).toHaveURL(new RegExp(`/processing/${createdPaymentId}`));
    await expect(page.getByRole("heading", { name: "Processing Payment" })).toBeVisible();

    // Step 4: Success
    await expect(page).toHaveURL(new RegExp(`/success/${createdPaymentId}`), {
      timeout: 10000,
    });
    await expect(page.getByRole("heading", { name: "Payment Successful" })).toBeVisible();

    // Step 5: Payment Details
    await page.getByRole("button", { name: /View Payment Details/i }).click();
    await expect(page).toHaveURL(new RegExp(`/payment-details/${createdPaymentId}`));
    await expect(page.getByText("Card")).toBeVisible();
    await expect(page.getByText("Success")).toBeVisible();
  });
});
