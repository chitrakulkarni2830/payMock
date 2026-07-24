import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, ArrowLeft, Lock } from "lucide-react";

import { getPayment, processPayment } from "../services/paymentApi";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import PaymentMethodSelector from "../components/payment/PaymentMethodSelector";
import UPIForm from "../components/payment/UPIForm";
import CardForm from "../components/payment/CardForm";

function Payment() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  // Ref-based guard: prevents double-submitting the Pay button.
  // The backend already rejects non-Pending payments, but this stops
  // the second network call from being issued at all.
  const isPaying = useRef(false);

  const validateExpiry = (expiry) => {
    if (!expiry || typeof expiry !== "string") return false;
    const match = expiry.trim().match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(`20${match[2]}`, 10);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  useEffect(() => {
    // Cancellation flag so StrictMode's double-mount doesn't set state
    // on an unmounted component or trigger spurious navigation.
    let isCancelled = false;

    const fetchPayment = async () => {
      try {
        const response = await getPayment(paymentId);
        if (!isCancelled) {
          if (response.data?.status === "Success") {
            navigate(`/success/${paymentId}`, { replace: true });
            return;
          }
          setPayment(response.data);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error);
          navigate("/checkout");
        }
      } finally {
        if (!isCancelled) setFetching(false);
      }
    };

    fetchPayment();

    return () => {
      isCancelled = true;
    };
  }, [paymentId, navigate]);

  const handlePay = async () => {
    // Validate form fields first
    const newErrors = {};

    if (paymentMethod === "UPI") {
      if (!upiId.trim()) {
        newErrors.upiId = "UPI ID is required";
      } else if (!upiId.includes("@")) {
        newErrors.upiId = "Please enter a valid UPI ID (e.g. user@upi)";
      }
    } else if (paymentMethod === "Card") {
      const rawCardNumber = card.cardNumber.replace(/\s/g, "");
      if (!rawCardNumber) {
        newErrors.cardNumber = "Card number is required";
      } else if (rawCardNumber.length < 13) {
        newErrors.cardNumber = "Card number must be at least 13 digits";
      }

      if (!card.cardHolderName.trim()) {
        newErrors.cardHolderName = "Cardholder name is required";
      }

      if (!card.expiry) {
        newErrors.expiry = "Expiry date is required";
      } else if (!validateExpiry(card.expiry)) {
        newErrors.expiry = "Invalid expiry (MM/YY, e.g. 12/28)";
      }

      if (!card.cvv) {
        newErrors.cvv = "CVV is required";
      } else if (card.cvv.length < 3) {
        newErrors.cvv = "CVV must be 3-4 digits";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Abort immediately if a pay request is already in-flight.
    if (isPaying.current) return;
    isPaying.current = true;

    try {
      setLoading(true);

      const payload =
        paymentMethod === "UPI"
          ? { paymentMethod: "UPI", upiId }
          : {
              paymentMethod: "Card",
              cardNumber: card.cardNumber.replace(/\s/g, ""),
              cardHolderName: card.cardHolderName,
              expiry: card.expiry,
              cvv: card.cvv,
            };

      await processPayment(paymentId, payload);
      navigate(`/processing/${paymentId}`);
    } catch (error) {
      console.error(error);
      // Release the guard on failure so the user can retry on the same page.
      isPaying.current = false;
      navigate(`/failed/${paymentId}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loader message="Loading checkout…" />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div style={{ width: "100%", maxWidth: "420px", animation: "fade-in-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
        <Card>
          {/* ── Header ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #0e4f5d 0%, #16697A 50%, #1d7f95 100%)",
              padding: "28px 32px",
              color: "#ffffff",
            }}
          >
            <button
              onClick={() => navigate("/checkout")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                padding: "0",
                marginBottom: "20px",
                fontFamily: "inherit",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <h1 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px" }}>
              Complete Payment
            </h1>

            {/* Amount row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: "500" }}>
                {payment?.merchantName || "PayMock Store"}
              </span>
              <span style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>
                ₹{payment?.amount || 0}
              </span>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "28px 32px 32px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8896a5", marginBottom: "16px" }}>
              Payment Method
            </p>

            <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />

            {/* Payment form */}
            <div style={{ marginTop: "24px" }}>
              {paymentMethod === "UPI" ? (
                <UPIForm
                  upiId={upiId}
                  setUpiId={setUpiId}
                  error={errors.upiId}
                  setError={(err) => setErrors((prev) => ({ ...prev, upiId: err }))}
                />
              ) : (
                <CardForm
                  card={card}
                  setCard={setCard}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
            </div>

            {/* Pay button */}
            <div style={{ marginTop: "28px" }}>
              <Button onClick={handlePay} loading={loading} variant="primary">
                <Lock size={15} />
                Pay ₹{payment?.amount || 0}
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

export default Payment;