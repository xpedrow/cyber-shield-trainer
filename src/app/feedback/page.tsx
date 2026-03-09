"use client";

import AppLayout from "@/components/AppLayout";

const metrics = [
  { label: "Score Total", value: 742, max: 1000, color: "var(--accent-cyan)", unit: "pts" },
  { label: "Phishing Detectado", value: 87, max: 100, color: "var(--accent-green)", unit: "%" },
  { label: "Resposta a Incidentes", value: 73, max: 100, color: "var(--accent-orange)", unit: "%" },
  { label: "Segurança de Senha", value: 90, max: 100, color: "var(--accent-purple)", unit: "%" },
];

const achievements = [
  { icon: "🎯", title: "Olho de Falcão", desc: "Detectou 10 e-mails de phishing", earned: true },
  { icon: "🛡️", title: "Escudo de Ferro", desc: "Completou 5 cenários sem erros", earned: true },
  { icon: "🕵️", title: "Detetive Digital", desc: "Identificou 3 sites falsos seguidos", earned: true },
  { icon: "🔒", title: "Guardião de Senhas", desc: "Score de senha acima de 95%", earned: false },
  { icon: "⚡", title: "Resposta Rápida", desc: "Respondeu a incidente em < 2 min", earned: false },
  { icon: "🏆", title: "Especialista Elite", desc: "Alcance score 900+", earned: false },
];

const weaknesses = [
  { area: "Engenharia Social", level: 45, tip: "Pratique o cenário de Vishing e sempre verifique a identidade de quem liga." },
  { area: "Segurança de Rede", level: 58, tip: "Estude sobre VPNs, firewalls e segmentação de rede." },
  { area: "Análise de Logs", level: 62, tip: "Revise o cenário de Ameaça Interna — foco em monitoramento." },
];

function RadarChart() {
  const skills = [
    { name: "Phishing", value: 87, angle: 0 },
    { name: "Senhas", value: 90, angle: 60 },
    { name: "Incidentes", value: 73, angle: 120 },
    { name: "Rede", value: 58, angle: 180 },
    { name: "Social Eng.", value: 45, angle: 240 },
    { name: "Logs", value: 62, angle: 300 },
  ];

  const center = 120;
  const maxR = 90;

  const toXY = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  const skillPoints = skills.map((s) => {
    const { x, y } = toXY(s.angle, (s.value / 100) * maxR);
    return `${x},${y}`;
  });

  const bgRings = [20, 40, 60, 80, 100].map((p) => {
    const pts = skills.map((s) => {
      const { x, y } = toXY(s.angle, (p / 100) * maxR);
      return `${x},${y}`;
    });
    return pts.join(" ");
  });

  return (
    <svg width="240" height="240" viewBox="0 0 240 240">
      {/* Grid rings */}
      {bgRings.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Axis lines */}
      {skills.map((s) => {
        const end = toXY(s.angle, maxR);
        return <line key={s.name} x1={center} y1={center} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      {/* Skill polygon */}
      <polygon
        points={skillPoints.join(" ")}
        fill="rgba(0,212,255,0.15)"
        stroke="var(--accent-cyan)"
        strokeWidth="1.5"
      />
      {/* Points */}
      {skills.map((s) => {
        const { x, y } = toXY(s.angle, (s.value / 100) * maxR);
        return <circle key={s.name} cx={x} cy={y} r="4" fill="var(--accent-cyan)" />;
      })}
      {/* Labels */}
      {skills.map((s) => {
        const { x, y } = toXY(s.angle, maxR + 16);
        return (
          <text key={s.name} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="var(--text-muted)" fontSize="10" fontWeight="600">
            {s.name}
          </text>
        );
      })}
    </svg>
  );
}

export default function Feedback() {
  return (
    <AppLayout>
      <div className="animate-fade-in-up" style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
          Feedback & Score de Segurança
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Análise completa do seu desempenho e áreas para melhorar.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Radar chart */}
        <div className="card animate-fade-in-up" style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.06em", alignSelf: "flex-start" }}>
            Mapa de Habilidades
          </h3>
          <RadarChart />
        </div>

        {/* Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="card animate-fade-in-up"
              style={{ padding: "18px 20px", animationDelay: `${i * 0.07}s` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)" }}>{m.label}</span>
                <span style={{ fontSize: "18px", fontWeight: 800, color: m.color }}>
                  {m.value}{m.unit}
                </span>
              </div>
              <div style={{ height: "6px", background: "var(--border-subtle)", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(m.value / m.max) * 100}%`,
                    height: "100%",
                    background: m.color,
                    borderRadius: "3px",
                    transition: "width 1.2s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Achievements */}
        <div className="card animate-fade-in-up" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Conquistas
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {achievements.map((a) => (
              <div
                key={a.title}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  background: a.earned ? "rgba(0,255,136,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${a.earned ? "rgba(0,255,136,0.2)" : "var(--border-subtle)"}`,
                  opacity: a.earned ? 1 : 0.5,
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>{a.icon}</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{a.title}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4 }}>{a.desc}</div>
                {a.earned && (
                  <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--accent-green)", fontWeight: 600 }}>✅ Conquistado</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses / Recommendations */}
        <div className="card animate-fade-in-up" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Áreas para Melhorar
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {weaknesses.map((w) => (
              <div key={w.area}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{w.area}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-orange)" }}>{w.level}%</span>
                </div>
                <div style={{ height: "6px", background: "var(--border-subtle)", borderRadius: "3px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{ width: `${w.level}%`, height: "100%", background: "var(--accent-orange)", borderRadius: "3px", transition: "width 1s ease" }} />
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,140,0,0.06)",
                    border: "1px solid rgba(255,140,0,0.15)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  💡 {w.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
