function Header({ activePage, setActivePage }) {
  const navigationItems = [
    {
      label: "Home",
      page: "landing",
    },
    {
      label: "Explore Rentals",
      page: "explore",
    },
    {
      label: "AI Assistant",
      page: "assistant",
    },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        boxSizing: "border-box",
        padding: "18px 6%",
        background: "rgba(8, 9, 11, 0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #1c1f24",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "30px",
        }}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => setActivePage("landing")}
          style={{
            border: "none",
            background: "transparent",
            color: "#f5f7fa",
            fontSize: "21px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Rentora<span style={{ color: "#8f96a0" }}> AI</span>
        </button>

        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {navigationItems.map((item) => {
            const isActive =
              activePage === item.page;

            return (
              <button
                key={item.page}
                type="button"
                onClick={() =>
                  setActivePage(item.page)
                }
                style={{
                  padding: "9px 13px",
                  borderRadius: "8px",
                  border: "1px solid transparent",
                  background: isActive
                    ? "#15181d"
                    : "transparent",
                  color: isActive
                    ? "#ffffff"
                    : "#949aa4",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: isActive
                    ? "600"
                    : "500",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Get Started */}
        <button
          type="button"
          onClick={() => setActivePage("signup")}
          style={{
            padding: "10px 17px",
            borderRadius: "9px",
            border: "none",
            background: "#f5f7fa",
            color: "#08090b",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Get Started
        </button>
      </div>
    </header>
  );
}

export default Header;