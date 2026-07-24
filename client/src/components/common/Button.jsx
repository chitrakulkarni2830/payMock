import { Loader2 } from "lucide-react";

const STYLES = {
  base: {
    position: "relative",
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "16px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "0.01em",
    lineHeight: "1",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-out",
    fontFamily: "inherit",
    outline: "none",
  },
  primary: {
    background: "#FFA62B",
    color: "#ffffff",
    boxShadow: "0 2px 8px -2px rgba(255,166,43,0.35)",
  },
  secondary: {
    background: "#16697A",
    color: "#ffffff",
    boxShadow: "0 2px 8px -2px rgba(22,105,122,0.25)",
  },
  ghost: {
    background: "#f0eeec",
    color: "#4b5c6e",
    boxShadow: "none",
  },
  disabled: {
    opacity: 0.45,
    cursor: "not-allowed",
    pointerEvents: "none",
  },
};

function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  style = {},
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={className}
      disabled={isDisabled}
      style={{
        ...STYLES.base,
        ...STYLES[variant],
        ...(isDisabled ? STYLES.disabled : {}),
        ...style,
      }}
      {...rest}
    >
      {loading && <Loader2 size={18} style={{ animation: "spin 1.2s linear infinite" }} />}
      {loading ? "Processing…" : children}
    </button>
  );
}

export default Button;
