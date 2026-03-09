"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";

type LoginSite = {
  id: string;
  name: string;
  url: string;
  realUrl: string;
  logoChar: string;
  logoColor: string;
  isFake: boolean;
  redFlags: string[];
  explanation: string;
};

const loginSites: LoginSite[] = [
  {
    id: "paypal-fake",
    name: "PayPal",
    url: "https://paypa1.com/login",
    realUrl: "paypal.com",
    logoChar: "P",
    logoColor: "#0070ba",
    isFake: true,
    redFlags: [
      "URL com '1' no lugar de 'l': paypa1.com",
      "Não usa HTTPS seguro correto",
      "Domínio diferente do oficial",
      "Certificado SSL genérico, não do PayPal",
    ],
    explanation: "Esta é uma página falsa. O domínio 'paypa1.com' usa o número '1' para imitar a letra 'l'. Sempre verifique o domínio antes de inserir credenciais.",
  },
  {
    id: "gmail-real",
    name: "Gmail / Google",
    url: "https://accounts.google.com/signin",
    realUrl: "accounts.google.com",
    logoChar: "G",
    logoColor: "#4285f4",
    isFake: false,
    redFlags: [],
    explanation: "Este é o login legítimo do Google. O domínio 'accounts.google.com' é o endereço oficial para autenticação de todos os serviços Google.",
  },
  {
    id: "itau-fake",
    name: "Itaú Unibanco",
    url: "https://itau-banco-seguro.net/login",
    realUrl: "itau.com.br",
    logoChar: "i",
    logoColor: "#ff6600",
    isFake: true,
    redFlags: [
      "Domínio 'itau-banco-seguro.net' não é o oficial",
      "Site do Itaú usa domínio .com.br, não .net",
      "URL muito longa e suspeita",
      "Certificado SSL de terceiros não verificado",
    ],
    explanation: "Página falsa! O Itaú opera exclusivamente no domínio itau.com.br. Qualquer outro domínio que imite a marca é uma tentativa de phishing.",
  },
  {
    id: "microsoft-real",
    name: "Microsoft",
    url: "https://login.microsoftonline.com",
    realUrl: "login.microsoftonline.com",
    logoChar: "M",
    logoColor: "#00a4ef",
    isFake: false,
    redFlags: [],
    explanation: "Login legítimo da Microsoft. O domínio 'login.microsoftonline.com' é o endereço oficial para autenticação de contas Microsoft 365 e outros serviços.",
  },
];

export default function LoginSimulator() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "fake" | "real" | null>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"inspect" | "answer">("inspect");
  const [attemptedLogin, setAttemptedLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const site = loginSites[current];
  const answered = answers[site.id];
  const totalAnswered = Object.keys(answers).length;

  const handleAnswer = (answer: "fake" | "real") => {
    if (answers[site.id]) return;
    const correct = (answer === "fake") === site.isFake;
    setAnswers((prev) => ({ ...prev, [site.id]: answer }));
    setScore((prev) => (correct ? prev + 100 : Math.max(0, prev - 40)));
    setShowResult(true);
    setAttemptedLogin(false);
    setUsername("");
    setPassword("");
  };

  const handleNext = () => {
    if (current < loginSites.length - 1) {
      setCurrent((c) => c + 1);
      setShowResult(false);
      setPhase("inspect");
    }
  };

  const handleLoginAttempt = () => {
    setAttemptedLogin(true);
  };

  const isComplete = totalAnswered === loginSites.length;

  return (
    <AppLayout>
      <div className="animate-fade-in-up" style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <span style={{ fontSize: "24px" }}>🔐</span>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)" }}>
            Simulador de Login
          </h1>
          <span
            style={{
              marginLeft: "auto",
              padding: "6px 16px",
              borderRadius: "100px",
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.2)",
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--accent-cyan)",
            }}
          >
            Score: {score}
          </span>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Analise cada página de login e identifique se é legítima ou falsa.
        </p>
      </div>

      {isComplete ? (
        <div
          className="card animate-fade-in-up"
          style={{ maxWidth: "500px", margin: "0 auto", padding: "40px", textAlign: "center" }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🏆</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--accent-cyan)", marginBottom: "8px" }}>
            Treino Concluído!
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Você completou o simulador de login falso.
          </p>
          <div style={{ fontSize: "48px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
            {score}
          </div>
          <div style={{ color: "var(--text-muted)", marginBottom: "24px" }}>pontos ganhos</div>
          <button
            className="btn-cyber btn-primary"
            onClick={() => { setCurrent(0); setAnswers({}); setScore(0); setShowResult(false); }}
          >
            🔄 Tentar Novamente
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" }}>
          {/* Main login panel */}
          <div>
            {/* Progress */}
            <div
              style={{ display: "flex", gap: "8px", marginBottom: "20px" }}
            >
              {loginSites.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { if (answers[s.id] || i <= current) { setCurrent(i); setShowResult(!!answers[s.id]); } }}
                  style={{
                    flex: 1,
                    height: "4px",
                    borderRadius: "2px",
                    border: "none",
                    cursor: i <= current || answers[s.id] ? "pointer" : "default",
                    background: answers[s.id]
                      ? ((answers[s.id] === "fake") === s.isFake ? "var(--accent-green)" : "var(--accent-red)")
                      : i === current ? "var(--accent-cyan)" : "var(--border-subtle)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* Simulated browser */}
            <div
              className="card"
              style={{ overflow: "hidden", border: "1px solid var(--border-subtle)" }}
            >
              {/* Browser chrome */}
              <div
                style={{
                  background: "#1a1a2e",
                  padding: "10px 16px",
                  borderBottom: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {/* Traffic lights */}
                <div style={{ display: "flex", gap: "6px" }}>
                  {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
                    <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
                  ))}
                </div>
                {/* URL bar */}
                <div
                  style={{
                    flex: 1,
                    background: "#0d1117",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: `1px solid ${site.isFake ? "rgba(255,68,68,0.3)" : "rgba(0,255,136,0.3)"}`,
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{site.isFake ? "⚠️" : "🔒"}</span>
                  <span className="font-mono" style={{ fontSize: "12px", color: site.isFake ? "var(--accent-red)" : "var(--accent-green)" }}>
                    {site.url}
                  </span>
                </div>
              </div>

              {/* Login page content */}
              <div
                style={{
                  padding: "48px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: "420px",
                  background: "var(--bg-primary)",
                }}
              >
                {/* Logo */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: site.logoColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    fontWeight: 900,
                    color: "white",
                    marginBottom: "16px",
                  }}
                >
                  {site.logoChar}
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                  Entrar no {site.name}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "28px" }}>{site.url}</p>

                {/* Form */}
                <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <input
                    className="cyber-input"
                    type="email"
                    placeholder="E-mail ou usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!!answered}
                    id={`username-${site.id}`}
                  />
                  <input
                    className="cyber-input"
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!!answered}
                    id={`password-${site.id}`}
                  />

                  {attemptedLogin && site.isFake && !answered && (
                    <div
                      className="animate-fade-in-up"
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        background: "rgba(255,68,68,0.1)",
                        border: "1px solid rgba(255,68,68,0.3)",
                        fontSize: "13px",
                        color: "var(--accent-red)",
                      }}
                    >
                      🚨 Atenção! Você está prestes a enviar seus dados para um site falso. Você teria sido comprometido!
                    </div>
                  )}

                  {!answered && (
                    <button
                      className="btn-cyber btn-primary"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={handleLoginAttempt}
                      id={`login-btn-${site.id}`}
                    >
                      Entrar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Answer buttons */}
            {!answered ? (
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button
                  className="btn-cyber btn-danger"
                  style={{ flex: 1, justifyContent: "center", padding: "14px" }}
                  onClick={() => handleAnswer("fake")}
                  id="btn-fake"
                >
                  🚨 Site Falso (Phishing)
                </button>
                <button
                  className="btn-cyber btn-success"
                  style={{ flex: 1, justifyContent: "center", padding: "14px" }}
                  onClick={() => handleAnswer("real")}
                  id="btn-real"
                >
                  ✅ Site Legítimo
                </button>
              </div>
            ) : (
              <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                {current < loginSites.length - 1 && (
                  <button className="btn-cyber btn-primary" onClick={handleNext} id="btn-next">
                    Próximo Site →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Checklist */}
            <div className="card" style={{ padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                O que verificar
              </h3>
              {[
                { label: "URL com HTTPS", info: "Cadeado verde na barra" },
                { label: "Domínio correto", info: `Site oficial: ${site.realUrl}` },
                { label: "Sem typosquatting", info: "Letras trocadas (paypa1)" },
                { label: "Sem subdomínio suspeito", info: "banco.site-falso.com" },
                { label: "Certificado válido", info: "Emitido pela empresa real" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                    <span style={{ fontSize: "10px", color: "var(--accent-cyan)", fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.info}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Result explanation */}
            {showResult && answered && (
              <div
                className="card animate-fade-in-up"
                style={{
                  padding: "20px",
                  border: `1px solid ${(answers[site.id] === "fake") === site.isFake ? "rgba(0,255,136,0.2)" : "rgba(255,68,68,0.2)"}`,
                }}
              >
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "20px" }}>
                    {(answers[site.id] === "fake") === site.isFake ? "✅" : "❌"}
                  </span>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: (answers[site.id] === "fake") === site.isFake ? "var(--accent-green)" : "var(--accent-red)" }}>
                    {(answers[site.id] === "fake") === site.isFake ? "Acertou!" : "Errou!"}
                  </h3>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
                  {site.explanation}
                </p>
                {site.redFlags.length > 0 && (
                  <>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent-red)", marginBottom: "6px" }}>Sinais de alerta:</p>
                    <ul style={{ paddingLeft: "16px" }}>
                      {site.redFlags.map((f, i) => (
                        <li key={i} style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>{f}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
