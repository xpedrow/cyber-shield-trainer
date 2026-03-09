"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const allScenarios = [
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
    href: "/email-simulator",
  },
  {
    id: "password-brute",
    title: "Simulador de Senha",
    description: "Crie senhas e veja quanto tempo um atacante levaria para quebrá-las usando Brute Force.",
    difficulty: "Médio",
    difficultyClass: "threat-medium",
    icon: "🔑",
    topics: ["Brute Force", "Entropia", "Vulnerabilidades comuns"],
    duration: "5 min",
    xp: 100,
    href: "/password-simulator",
  },
  {
    id: "fake-login",
    title: "Página de Login Falsa",
    description: "Detecte páginas de login falsas criadas para capturar senhas e invadir suas contas.",
    difficulty: "Alto",
    difficultyClass: "threat-high",
    icon: "🔐",
    topics: ["Typosquatting", "HTTPS/SSL", "Certificados Digitais"],
    duration: "15 min",
    xp: 200,
    href: "/login-simulator",
  },
  {
    id: "social-engineering",
    title: "Engenharia Social",
    description: "Um suposto técnico de TI liga pedindo suas credenciais para 'atualizar o sistema'.",
    difficulty: "Crítico",
    difficultyClass: "threat-critical",
    icon: "🕵️",
    topics: ["Vishing", "Pretexting", "Verificação de identidade"],
    duration: "8 min",
    xp: 250,
    href: "/social-engineering",
  },
  {
    id: "network-attack",
    title: "Ataque de Rede (IDS)",
    description: "Analise logs de sistema e tome decisões rápidas para bloquear invasores em tempo real.",
    difficulty: "Médio",
    difficultyClass: "threat-medium",
    icon: "🛰️",
    topics: ["Port Scanning", "Brute Force", "DDoS Mitigation"],
    duration: "12 min",
    xp: 175,
    href: "/network-attack",
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
    href: "#",
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
    href: "#",
  },
];

export default function Scenarios() {
  const [filter, setFilter] = useState("Todos");

  const filteredScenarios = allScenarios.filter(
    (sc) => filter === "Todos" || sc.difficulty === filter
  );

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
            onClick={() => setFilter(f)}
            className={`btn-cyber ${filter === f ? "btn-primary" : "btn-ghost"}`}
            style={{ padding: "6px 14px", fontSize: "13px" }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Scenarios grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
        <AnimatePresence mode="popLayout">
          {filteredScenarios.map((sc, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={sc.id}
              className="card glass-hover"
              style={{ padding: "24px", display: "flex", flexDirection: "column" }}
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
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "16px", flex: 1 }}>
                {sc.description}
              </p>

              {/* Topics */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
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
                {sc.href !== "#" ? (
                  <Link href={sc.href} className="btn-cyber btn-primary" style={{ padding: "7px 16px", fontSize: "13px" }}>
                    Iniciar →
                  </Link>
                ) : (
                  <button disabled className="btn-cyber btn-ghost" style={{ padding: "7px 16px", fontSize: "13px", opacity: 0.5, cursor: "not-allowed" }}>
                    Em breve
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
