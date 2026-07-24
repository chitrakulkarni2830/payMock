import { Check, X } from "lucide-react";

function StatusIcon({ type }) {
  const isSuccess = type === "success";
  const color = isSuccess ? "#0d9f4f" : "#e03e3e";
  const bgLight = isSuccess ? "rgba(13,159,79,0.12)" : "rgba(224,62,62,0.12)";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "80px",
        height: "80px",
        margin: "0 auto",
      }}
    >
      {/* Pulsing ring */}
      <span
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: bgLight,
          animation: "pulse-ring 2s cubic-bezier(0.4,0,0.2,1) infinite",
        }}
      />

      {/* Icon circle */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: color,
          animation: "check-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {isSuccess ? (
          <Check size={32} strokeWidth={3} color="#ffffff" />
        ) : (
          <X
            size={32}
            strokeWidth={3}
            color="#ffffff"
            style={{ animation: "shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both" }}
          />
        )}
      </div>
    </div>
  );
}

export default StatusIcon;
