"use client";

import AppLayout from "@/components/AppLayout";

const scenarios = [
  {
    id: "phishing-email",
    title: "Phishing por E-mail",
    description: "Você recebe um e-mail dizendo que sua conta bancária foi comprometida e precisa verificar seus dados urgentemente.",
    difficulty: "Médio",
    difficultyClass: "threat-medium",
    icon: "📧",
    topics: ["Reconhecimento de domínios falsos", "Urgência como gatilho", "Verificação de links"],
    duration: "10 min",
    xp: 150,
  },
  {
    id: "ransomware",
    title: "Ransomware Corporativo",
    description: "Um arquivo enviado por e-mail infecta sua estação de trabalho. Você precisa agir rapidamente para conter o dano.",
    difficulty: "Crítico",
    difficultyClass: "threat-critical",
    icon: "💀",
    topics: ["Isolamento de rede", "Resposta a incidentes", "Backup e recuperação"],
    duration: "20 min",
    xp: 300,
  },
  {
    id: "social-engineering",
    title: "Engenharia Social",
    description: "Um suposto técnico de TI liga pedindo suas credenciais para 'atualizar o sistema'.",
    difficulty: "Alto",
    difficultyClass: "threat-high",
    icon: "🕵️",
    topics: ["Vishing", "Pretexting", "Verificação de identidade"],
    duration: "8 min",
    xp: 200,
  },
  {
    id: "weak-password",
    title: "Ataque de Força Bruta",
    description: "Seu sistema está sendo atacado. Você precisa identificar contas vulneráveis e protegê-las.",
    difficulty: "Médio",
    difficultyClass: "threat-medium",
    icon: "🔑",
    topics: ["Políticas de senha", "MFA", "Bloqueio de conta"],
    duration: "12 min",
    xp: 175,
  },
  {
    id: "insider-threat",
    title: "Ameaça Interna",
    description: "Dados sensíveis estão vazando da empresa. Identifique o vetor de saída e tome as medidas corretas.",
    difficulty: "Alto",
    difficultyClass: "threat-high",
    icon: "🔍",
    topics: ["DLP", "Monitoramento de logs", "Política de acesso"],
    duration: "15 min",
    xp: 220,
  },
  {
    id: "sql-injection",
    title: "Injeção SQL",
    description: "Um formulário do seu sistema está vulnerável. Identifique a falha e entenda como ela pode ser explorada.",
    difficulty: "Crítico",
    difficultyClass: "threat-critical",
    icon: "💉",
    topics: ["Validação de entrada", "Prepared statements", "OWASP Top 10"],
    duration: "18 min",
    xp: 280,
  },
];

export default function Scenarios() {
  return (
    <AppLayout>
      <div className="animate-fade-in-up" style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
          Cenários de Ataque
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Situações realistas para treinar sua resposta a incidentes. Cada cenário simula um ataque real e avalia suas decisões.
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {["Todos", "Médio", "Alto", "Crítico"].map((f) => (
          <button
            key={f}
            className="btn-cyber btn-ghost"
            style={{ padding: "6px 14px", fontSize: "13px" }}
            id={`filter-${f.toLowerCase()}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Scenarios grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
        {scenarios.map((sc, i) => (
          <div
            key={sc.id}
            className="card glass-hover animate-fade-in-up"
            style={{ padding: "24px", cursor: "pointer", animationDelay: `${i * 0.07}s` }}
            id={`scenario-${sc.id}`}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div style={{ fontSize: "32px" }}>{sc.icon}</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                <span
                  className={sc.difficultyClass}
                  style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", border: "1px solid" }}
                >
                  {sc.difficulty}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{sc.duration}</span>
              </div>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
              {sc.title}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "16px" }}>
              {sc.description}
            </p>

            {/* Topics */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
              {sc.topics.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--accent-cyan)",
                    fontWeight: 500,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "16px" }}>⚡</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-cyan)" }}>+{sc.xp} XP</span>
              </div>
              <button className="btn-cyber btn-primary" style={{ padding: "7px 16px", fontSize: "13px" }} id={`start-${sc.id}`}>
                Iniciar →
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
