import { Loader2 } from "lucide-react";

function Loader({ message = "Loading…" }) {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "64px",
          height: "64px",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(22,105,122,0.08)",
            animation: "pulse-soft 2s ease-in-out infinite",
          }}
        />
        <Loader2
          size={32}
          style={{
            color: "#16697A",
            animation: "spin 1.2s linear infinite",
          }}
        />
      </div>

      <p
        style={{
          marginTop: "20px",
          fontSize: "14px",
          fontWeight: "500",
          color: "#4b5c6e",
        }}
      >
        {message}
      </p>
    </main>
  );
}

export default Loader;
