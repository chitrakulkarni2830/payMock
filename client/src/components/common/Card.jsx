function Card({ children, className = "", style = {}, ...rest }) {
  return (
    <div
      className={`overflow-hidden rounded-3xl ${className}`}
      style={{
        background: "#ffffff",
        border: "1px solid #f0eeec",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 50px -12px rgba(22,105,122,0.12)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
