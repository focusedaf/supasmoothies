const MobileWarning = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.6)", 
      color: "#fff",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)", 
    }}
    role="alert"
    aria-live="assertive"
  >
    <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
     mobile pe mat khol bc
    </h2>
    <span style={{ fontSize: "1rem" }}>
      use a laptop
    </span>
  </div>
);

export default MobileWarning;
