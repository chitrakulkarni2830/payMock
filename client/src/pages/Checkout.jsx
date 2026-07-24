import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Store, Hash, ShoppingBag, ArrowRight } from "lucide-react";

import { createPayment } from "../services/paymentApi";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const MOCK_ORDER = {
  merchantName: "PayMock Store",
  customerName: "Demo Customer",
  orderId: "ORD-2024-7829",
  product: "Premium Plan",
  amount: 499,
  currency: "INR",
};

function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref-based guard: synchronously prevents duplicate POST calls.
  // Unlike useState, a ref update is immediate and does not require a
  // re-render cycle, so rapid double-clicks and React StrictMode
  // double-invocation cannot slip a second request through.
  const isSubmitting = useRef(false);

  const handleContinue = useCallback(async () => {
    // Abort immediately if a request is already in-flight.
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      setLoading(true);
      setError(null);

      const response = await createPayment({
        merchantName: MOCK_ORDER.merchantName,
        customerName: MOCK_ORDER.customerName,
        amount: MOCK_ORDER.amount,
        currency: MOCK_ORDER.currency,
      });

      navigate(`/payment/${response.data.paymentId}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Unable to initiate payment. Try again."
      );
      // Only reset the gate on failure so the user can retry.
      // On success we've already navigated away.
      isSubmitting.current = false;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div style={{ width: "100%", maxWidth: "420px", animation: "fade-in-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
        <Card>
          {/* ── Header ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #0e4f5d 0%, #16697A 50%, #1d7f95 100%)",
              padding: "32px",
              color: "#ffffff",
            }}
          >
            {/* Merchant */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.12)",
                }}
              >
                <Store size={18} />
              </div>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>
                  Merchant
                </p>
                <h1 style={{ fontSize: "16px", fontWeight: "800", lineHeight: "1.2" }}>
                  {MOCK_ORDER.merchantName}
                </h1>
              </div>
            </div>

            {/* Order ID */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "16px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
              <Hash size={12} />
              <span style={{ fontWeight: "500" }}>{MOCK_ORDER.orderId}</span>
            </div>

            {/* Amount */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "20px" }}>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "rgba(255,255,255,0.55)" }}>₹</span>
              <span style={{ fontSize: "52px", fontWeight: "800", letterSpacing: "-2px", lineHeight: "1" }}>
                {MOCK_ORDER.amount}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.5)", marginLeft: "6px" }}>
                {MOCK_ORDER.currency}
              </span>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "28px 32px 32px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8896a5", marginBottom: "16px" }}>
              Order Summary
            </p>

            {/* Summary card */}
            <div style={{ borderRadius: "16px", border: "1px solid #f0eeec", background: "#faf9f8", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", background: "rgba(22,105,122,0.08)" }}>
                    <ShoppingBag size={14} color="#16697A" />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a2332" }}>{MOCK_ORDER.product}</span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a2332" }}>₹{MOCK_ORDER.amount}</span>
              </div>

              <div style={{ height: "1px", background: "#f0eeec" }} />

              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                <span style={{ fontSize: "13px", color: "#8896a5" }}>Tax</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a2332" }}>₹0</span>
              </div>

              <div style={{ height: "1px", background: "#f0eeec" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "rgba(22,105,122,0.03)" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a2332" }}>Total</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#16697A" }}>₹{MOCK_ORDER.amount}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(224,62,62,0.2)",
                  background: "#fff5f5",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#e03e3e",
                }}
              >
                {error}
              </div>
            )}

            {/* CTA */}
            <div style={{ marginTop: "24px" }}>
              <Button onClick={handleContinue} loading={loading} variant="primary">
                Continue to Payment
                {!loading && <ArrowRight size={16} />}
              </Button>
            </div>

            {/* Secure badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "20px", fontSize: "11px", fontWeight: "600", color: "#8896a5" }}>
              <Shield size={13} />
              <span>Secured by PayMock</span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Checkout;