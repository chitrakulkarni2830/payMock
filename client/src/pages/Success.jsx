import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import StatusIcon from "../components/common/StatusIcon";

function Success() {
  const { paymentId } = useParams();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div style={{ width: "100%", maxWidth: "420px", animation: "fade-in-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
        <Card>
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <StatusIcon type="success" />

            <h1 style={{ marginTop: "24px", fontSize: "22px", fontWeight: "800", color: "#1a2332" }}>
              Payment Successful
            </h1>

            <p style={{ marginTop: "8px", fontSize: "14px", color: "#8896a5" }}>
              Your payment has been processed successfully.
            </p>

            {/* Receipt */}
            <div style={{ margin: "28px auto 0", maxWidth: "320px", borderRadius: "16px", border: "1px solid #f0eeec", background: "#faf9f8", padding: "20px", textAlign: "left" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8896a5" }}>
                  Payment ID
                </p>
                <p style={{ marginTop: "4px", fontSize: "12px", fontWeight: "600", color: "#1a2332", wordBreak: "break-all" }}>
                  {paymentId}
                </p>
              </div>

              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f0eeec", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#8896a5" }}>Status</span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "4px 10px", borderRadius: "99px",
                  background: "rgba(13,159,79,0.1)",
                  fontSize: "11px", fontWeight: "700", color: "#0d9f4f",
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0d9f4f", display: "inline-block" }} />
                  Success
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px", margin: "28px auto 0" }}>
              <Link to={`/payment-details/${paymentId}`}>
                <Button variant="secondary">
                  View Payment Details
                  <ArrowRight size={15} />
                </Button>
              </Link>

              <Link
                to="/checkout"
                style={{ display: "block", marginTop: "4px", fontSize: "13px", fontWeight: "700", color: "#16697A", textAlign: "center" }}
              >
                Make Another Payment
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Success;