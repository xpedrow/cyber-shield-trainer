import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--black)" }}>
      {/* ═══ HEADER ═══ */}
      <header
        style={{
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          background: "var(--black2)",
          borderBottom: "1px solid var(--border)",
          position: "relative",
          zIndex: 100,
          flexShrink: 0
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--display)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.12em", color: "var(--green)" }}>
          <div style={{ width: "30px", height: "30px", border: "1.5px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>⬢</div>
          CYBER<span style={{ color: "var(--cyan)" }}>SHIELD</span>
          <span style={{ fontSize: "0.55rem", color: "var(--muted)", letterSpacing: "0.15em", marginLeft: "4px", alignSelf: "flex-end", marginBottom: "2px" }}>TRAINER v2.0</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "0.68rem", letterSpacing: "0.1em", color: "var(--muted)", fontFamily: "var(--mono)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 5px var(--green)" }}></div>
            SISTEMA OPERACIONAL
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--amber)", boxShadow: "0 0 5px var(--amber)" }}></div>
            FIREWALL ATIVO
          </div>
          <div style={{ fontFamily: "var(--display)", fontSize: "0.75rem", color: "var(--cyan)" }}>
            SCORE: <span style={{ color: "var(--green)", fontWeight: 700 }}>742</span>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--green), transparent)" }}></div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            minHeight: "100%",
            position: "relative",
            fontFamily: "var(--mono)"
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
