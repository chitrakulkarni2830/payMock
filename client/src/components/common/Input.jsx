function Input({ label, icon: Icon, error, className = "", style = {}, ...rest }) {
  return (
    <div className={className} style={style}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#4b5c6e",
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={16}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#8896a5",
            }}
          />
        )}

        <input
          style={{
            width: "100%",
            border: `1.5px solid ${error ? "#e03e3e" : "#e2e0de"}`,
            borderRadius: "12px",
            background: "#faf9f8",
            padding: "13px 16px",
            paddingLeft: Icon ? "44px" : "16px",
            fontSize: "15px",
            color: "#1a2332",
            fontFamily: "inherit",
            outline: "none",
            transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? "#e03e3e" : "#16697A";
            e.target.style.background = "#ffffff";
            e.target.style.boxShadow = error
              ? "0 0 0 3px rgba(224,62,62,0.08)"
              : "0 0 0 3px rgba(22,105,122,0.08)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "#e03e3e" : "#e2e0de";
            e.target.style.background = "#faf9f8";
            e.target.style.boxShadow = "none";
          }}
          {...rest}
        />
      </div>

      {error && (
        <p
          style={{
            marginTop: "6px",
            fontSize: "12px",
            fontWeight: "500",
            color: "#e03e3e",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
