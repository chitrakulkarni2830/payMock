import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, Loader2 } from "lucide-react";
import Card from "../components/common/Card";
import { getPayment } from "../services/paymentApi";

function Processing() {
  const navigate = useNavigate();
  const { paymentId } = useParams();

  useEffect(() => {
    // Cancellation flag: if React StrictMode unmounts and remounts this
    // component in development, the first async call sees isCancelled=true
    // and skips navigation, preventing a double-navigate race condition.
    let isCancelled = false;

    const checkStatus = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Bail out if the component was unmounted before the timer resolved.
        if (isCancelled) return;

        const response = await getPayment(paymentId);

        if (isCancelled) return;

        const status = response.data.status;

        if (status === "Success") {
          navigate(`/success/${paymentId}`, { replace: true });
        } else {
          navigate(`/failed/${paymentId}`, { replace: true });
        }
      } catch (error) {
        if (isCancelled) return;
        console.error(error);
        navigate(`/failed/${paymentId}`, { replace: true });
      }
    };

    checkStatus();

    // Cleanup: cancel any in-flight work when the component unmounts.
    return () => {
      isCancelled = true;
    };
  }, [navigate, paymentId]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div style={{ width: "100%", maxWidth: "420px", animation: "fade-in-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
        <Card>
          <div style={{ padding: "56px 32px", textAlign: "center" }}>
            {/* Spinner */}
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "80px", height: "80px" }}>
              <span style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(22,105,122,0.08)",
                animation: "pulse-soft 2s ease-in-out infinite",
              }} />
              <Loader2
                size={40}
                strokeWidth={2}
                style={{ color: "#16697A", animation: "spin 1.2s linear infinite", position: "relative", zIndex: 1 }}
              />
            </div>

            <h1 style={{ marginTop: "28px", fontSize: "20px", fontWeight: "800", color: "#1a2332" }}>
              Processing Payment
            </h1>

            <p className="animate-dots" style={{ marginTop: "8px", fontSize: "14px", color: "#8896a5" }}>
              Please wait while we securely process your payment
            </p>

            {/* Progress bar */}
            <div style={{ margin: "28px auto 0", height: "3px", width: "160px", borderRadius: "99px", background: "#f0eeec", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: "40%",
                borderRadius: "99px",
                background: "linear-gradient(90deg, #16697A, #489FB5)",
                animation: "progress-indeterminate 1.5s ease-in-out infinite",
              }} />
            </div>

            {/* Payment ID */}
            <div style={{ margin: "28px auto 0", maxWidth: "280px", padding: "12px 16px", borderRadius: "12px", border: "1px solid #f0eeec", background: "#faf9f8" }}>
              <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8896a5" }}>
                Payment ID
              </p>
              <p style={{ marginTop: "4px", fontSize: "12px", fontWeight: "600", color: "#1a2332", wordBreak: "break-all" }}>
                {paymentId}
              </p>
            </div>

            {/* Secure badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "28px", fontSize: "11px", fontWeight: "600", color: "#8896a5" }}>
              <Shield size={13} />
              <span>Secured by PayMock</span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Processing;