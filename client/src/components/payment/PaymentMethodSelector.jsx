import { Smartphone, CreditCard } from "lucide-react";

const methods = [
  { id: "UPI", label: "UPI", icon: Smartphone, desc: "Pay with any UPI app" },
  { id: "Card", label: "Card", icon: CreditCard, desc: "Debit or credit card" },
];

function PaymentMethodSelector({ selected, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {methods.map(({ id, label, icon: Icon, desc }) => {
        const isActive = selected === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              borderRadius: "16px",
              border: isActive ? "2px solid #16697A" : "1.5px solid #e2e0de",
              background: isActive ? "rgba(22,105,122,0.04)" : "#ffffff",
              padding: "16px 12px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              outline: "none",
              boxShadow: isActive ? "0 0 0 3px rgba(22,105,122,0.08)" : "none",
              fontFamily: "inherit",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: isActive ? "#16697A" : "#f0eeec",
                color: isActive ? "#ffffff" : "#4b5c6e",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={18} />
            </div>

            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: isActive ? "#16697A" : "#1a2332",
                fontFamily: "inherit",
              }}
            >
              {label}
            </span>

            <span
              style={{
                fontSize: "11px",
                color: "#8896a5",
                textAlign: "center",
                lineHeight: "1.3",
                fontFamily: "inherit",
              }}
            >
              {desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default PaymentMethodSelector;
