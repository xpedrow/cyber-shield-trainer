import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        className="grid-bg"
        style={{
          flex: 1,
          padding: "40px 48px",
          overflowY: "auto",
          minWidth: 0,
          background: "var(--bg-primary)",
          position: "relative"
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
