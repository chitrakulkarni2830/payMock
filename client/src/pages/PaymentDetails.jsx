import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";

import { getPayment } from "../services/paymentApi";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

const STATUS_STYLE = {
  Success: { bg: "rgba(13,159,79,0.1)", text: "#0d9f4f", dot: "#0d9f4f" },
  Failed:  { bg: "rgba(224,62,62,0.1)", text: "#e03e3e", dot: "#e03e3e" },
  Pending: { bg: "rgba(255,166,43,0.1)", text: "#e8931f", dot: "#FFA62B" },
};

function PaymentDetails() {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await getPayment(paymentId);
        setPayment(response.data);
      } catch (err) {
        console.error(err);
        setError("Could not load payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  if (loading) return <Loader message="Fetching payment details…" />;

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <Card>
            <div style={{ padding: "40px 32px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#e03e3e" }}>{error}</p>
              <Link to="/checkout" style={{ display: "block", marginTop: "24px" }}>
                <Button variant="ghost">Go Back</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  const details = [
    { label: "Payment ID", value: payment.paymentId, mono: true },
    { label: "Merchant", value: payment.merchantName },
    { label: "Customer", value: payment.customerName },
    { label: "Amount", value: `₹${payment.amount}`, highlight: true },
    { label: "Currency", value: payment.currency },
    { label: "Payment Method", value: payment.paymentMethod },
    { label: "Status", value: payment.status, isPill: true },
    {
      label: "Created",
      value: new Date(payment.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div style={{ width: "100%", maxWidth: "420px", animation: "fade-in-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
        <Card>
          {/* ── Header ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #0e4f5d 0%, #16697A 50%, #1d7f95 100%)",
              padding: "28px 32px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }}>
              <FileText size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "16px", fontWeight: "800", lineHeight: "1.2" }}>
                Payment Details
              </h1>
              <p style={{ marginTop: "2px", fontSize: "11px", fontWeight: "500", color: "rgba(255,255,255,0.5)" }}>
                Complete transaction record
              </p>
            </div>
          </div>

          {/* ── Details ── */}
          <div style={{ padding: "24px 32px 32px" }}>
            <div>
              {details.map(({ label, value, isPill, highlight, mono }, i) => {
                const st = STATUS_STYLE[value] || {};
                return (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "14px 0",
                      borderBottom: i < details.length - 1 ? "1px solid #f0eeec" : "none",
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "500", color: "#8896a5", whiteSpace: "nowrap" }}>
                      {label}
                    </span>

                    {isPill ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "4px 10px", borderRadius: "99px",
                        background: st.bg,
                        fontSize: "11px", fontWeight: "700", color: st.text,
                      }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: st.dot, display: "inline-block" }} />
                        {value}
                      </span>
                    ) : (
                      <span style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: highlight ? "#16697A" : "#1a2332",
                        textAlign: "right",
                        wordBreak: "break-all",
                        maxWidth: "55%",
                        fontFamily: mono ? "monospace" : "inherit",
                      }}>
                        {value}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>


          </div>
        </Card>
      </div>
    </main>
  );
}

export default PaymentDetails;