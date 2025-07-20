const MobileWarning = () => (
  <div
    style={{
      position: "fixed",
      inset: 0, 
      background: "rgba(0, 0, 0, 0.6)",
      color: "#fff",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      flexDirection: "column",
    }}
    role="alert"
    aria-live="assertive"
  >
    <div>
      <h2 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        mobile pe mat khol bc
      </h2>
      <span style={{ fontSize: "1rem" }}>use a laptop</span>
    </div>
  </div>
);

export default MobileWarning;
