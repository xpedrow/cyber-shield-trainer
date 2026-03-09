"use client";

import AppLayout from "@/components/AppLayout";
import Link from "next/link";

const stats = [
  { label: "Score de Segurança", value: "742", unit: "/1000", color: "var(--accent-cyan)", icon: "🛡️" },
  { label: "Cenários Completados", value: "12", unit: "/20", color: "var(--accent-green)", icon: "✅" },
  { label: "Ameaças Identificadas", value: "48", unit: "", color: "var(--accent-orange)", icon: "⚡" },
  { label: "Taxa de Acerto", value: "87", unit: "%", color: "var(--accent-purple)", icon: "🎯" },
];

const recentActivity = [
  { type: "success", message: "Identificou phishing em e-mail suspeito", time: "2 min atrás", scenario: "Simulador de E-mail" },
  { type: "warning", message: "Tentou login em site falso detectado", time: "15 min atrás", scenario: "Simulador de Login" },
  { type: "success", message: "Bloqueou ataque de força bruta", time: "1h atrás", scenario: "Cenário: Banco" },
  { type: "error", message: "Clicou em link malicioso — revise", time: "2h atrás", scenario: "Simulador de E-mail" },
  { type: "success", message: "Relatou incidente de segurança corretamente", time: "3h atrás", scenario: "Cenário: Empresa" },
];

const scenarios = [
  {
    id: "phishing",
    title: "Ataque de Phishing",
    description: "Identifique e-mails fraudulentos tentando roubar suas credenciais.",
    difficulty: "Médio",
    difficultyClass: "threat-medium",
    icon: "📧",
    href: "/email-simulator",
    progress: 60,
  },
  {
    id: "fake-login",
    title: "Login Falso",
    description: "Detecte páginas de login falsas criadas para capturar senhas.",
    difficulty: "Alto",
    difficultyClass: "threat-high",
    icon: "🔐",
    href: "/login-simulator",
    progress: 30,
  },
  {
    id: "social",
    title: "Engenharia Social",
    description: "Reconheça manipulações psicológicas usadas por atacantes.",
    difficulty: "Crítico",
    difficultyClass: "threat-critical",
    icon: "🕵️",
    href: "/social-engineering",
    progress: 10,
  },
  {
    id: "network",
    title: "Ataque de Rede",
    description: "Analise logs e tome decisões contra invasões em tempo real.",
    difficulty: "Médio",
    difficultyClass: "threat-medium",
    icon: "🛰️",
    href: "/network-attack",
    progress: 0,
  },
];

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 1000) * circumference;

  return (
    <div style={{ position: "relative", width: "140px", height: "140px" }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#0066ff" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <span className="gradient-text-cyan" style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>/ 1000</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
              Dashboard de Segurança
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
              Bem-vindo de volta, Trainee. Seus treinos aguardam.
            </p>
          </div>
          <div
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(0, 255, 136, 0.08)",
              border: "1px solid rgba(0, 255, 136, 0.2)",
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-green)", display: "block", animation: "pulse-glow 2s infinite" }} />
            <span style={{ fontSize: "13px", color: "var(--accent-green)", fontWeight: 600 }}>Sistema Ativo</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="card animate-fade-in-up"
            style={{ padding: "20px", animationDelay: `${i * 0.1}s` }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "22px" }}>{stat.icon}</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>LIVE</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: 800, color: stat.color, lineHeight: 1 }}>
              {stat.value}<span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-muted)" }}>{stat.unit}</span>
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
        {/* Scenarios */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>Cenários de Treino</h2>
            <Link href="/scenarios" style={{ fontSize: "13px", color: "var(--accent-cyan)", textDecoration: "none" }}>Ver todos →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {scenarios.map((sc, i) => (
              <Link
                key={sc.id}
                href={sc.href}
                style={{ textDecoration: "none" }}
                className="animate-fade-in-up"
              >
                <div
                  className="card glass-hover"
                  style={{ padding: "20px", cursor: "pointer", animationDelay: `${i * 0.1}s` }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        width: "48px", height: "48px",
                        borderRadius: "10px",
                        background: "var(--bg-secondary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {sc.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{sc.title}</h3>
                        <span
                          className={sc.difficultyClass}
                          style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "100px", border: "1px solid", flexShrink: 0 }}
                        >
                          {sc.difficulty}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>{sc.description}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ flex: 1, height: "4px", background: "var(--border-subtle)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: `${sc.progress}%`, height: "100%", background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))", borderRadius: "2px", transition: "width 1s ease" }} />
                        </div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", flexShrink: 0 }}>{sc.progress}%</span>
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: "4px" }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Score panel */}
          <div className="card" style={{ padding: "24px", textAlign: "center" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Score de Segurança
            </h3>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              <ScoreRing score={742} />
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "100px",
                background: "rgba(0, 212, 255, 0.1)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--accent-cyan)",
                marginBottom: "16px",
              }}
            >
              Nível Intermediário
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              +58 pontos para o nível Avançado
            </p>
          </div>

          {/* Recent activity */}
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Atividade Recente
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentActivity.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "8px", height: "8px",
                      borderRadius: "50%",
                      background: item.type === "success" ? "var(--accent-green)" : item.type === "warning" ? "var(--accent-orange)" : "var(--accent-red)",
                      marginTop: "5px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "12px", color: "var(--text-primary)", lineHeight: 1.4 }}>{item.message}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{item.time} · {item.scenario}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
