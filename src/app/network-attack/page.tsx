"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";

interface NetworkAttack {
  id: string;
  type: string;
  ip: string;
  logs: string[];
  description: string;
  severity: string;
  correctAction: 'block' | 'monitor' | 'ignore';
}

const fallbackAttacks: NetworkAttack[] = [
  {
    id: 'bf-login-01',
    type: 'brute-force',
    ip: '185.203.119.2',
    logs: [
      '[NOTICE] 2.026-03-09 10:00:01 - Failed login attempt for user "admin" from 185.203.119.2',
      '[NOTICE] 2.026-03-09 10:00:02 - Failed login attempt for user "root" from 185.203.119.2',
      '[NOTICE] 2.026-03-09 10:00:03 - Failed login attempt for user "manager" from 185.203.119.2',
      '[WARNING] 2.026-03-09 10:00:10 - 120 failed login attempts in 10 seconds from 185.203.119.2',
    ],
    description: 'Múltiplas tentativas de login falhas detectadas em curto intervalo de tempo.',
    severity: 'high',
    correctAction: 'block',
  },
  {
    id: 'ps-internal-01',
    type: 'port-scanning',
    ip: '10.0.0.45',
    logs: [
      '[INFO] TCP Connection attempt on port 21 (FTP) from 10.0.0.45',
      '[INFO] TCP Connection attempt on port 22 (SSH) from 10.0.0.45',
      '[INFO] TCP Connection attempt on port 23 (Telnet) from 10.0.0.45',
      '[INFO] TCP Connection attempt on port 80 (HTTP) from 10.0.0.45',
    ],
    description: 'Varredura de portas (Port Scanning) sequencial detectada vindo de IP interno.',
    severity: 'medium',
    correctAction: 'monitor',
  }
];

export default function NetworkAttackPage() {
  const [attacks, setAttacks] = useState<NetworkAttack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchAttacks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/simulations/network`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          }
        });
        if (!response.ok) throw new Error("Unauthorized or server error");
        const data = await response.json();
        if (Array.isArray(data)) {
          setAttacks(data);
        } else {
          setAttacks(fallbackAttacks);
        }
      } catch (error) {
        console.error("Error fetching attacks, using fallbacks:", error);
        setAttacks(fallbackAttacks);
      } finally {
        setLoading(false);
      }
    };

    fetchAttacks();
  }, []);

  useEffect(() => {
    if (attacks.length > 0) {
      const currentAttack = attacks[currentIndex];
      setVisibleLogs([]);
      let i = 0;
      const interval = setInterval(() => {
        if (i < currentAttack.logs.length) {
          setVisibleLogs(prev => [...prev, currentAttack.logs[i]]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [currentIndex, attacks]);

  const handleAction = async (action: 'block' | 'monitor' | 'ignore') => {
    const attack = attacks[currentIndex];

    // Play locally if fetch fails
    const isCorrect = action === attack.correctAction;
    const localResult = {
      success: isCorrect,
      analysis: isCorrect
        ? "Decisão correta! Bloquear IPs suspeitos ou monitorar tráfego anômalo é vital para o IDS."
        : `Ação não recomendada. Para um ataque de ${attack.type} (${attack.severity}), o ideal seria ${attack.correctAction}.`,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/simulations/network/handle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          attackId: attack.id,
          action,
        }),
      });
      const data = await response.json();
      setResult(data.analysis ? data : localResult);
    } catch (error) {
      console.error("Error handling attack, using local result:", error);
      setResult(localResult);
    }
  };

  const nextAttack = () => {
    setResult(null);
    setCurrentIndex((prev) => (prev + 1) % attacks.length);
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <div className="loading-bar" style={{ width: '200px', margin: '20px auto' }}></div>
          Iniciando monitoramento de rede...
        </div>
      </AppLayout>
    );
  }

  const currentAttack = attacks[currentIndex] || fallbackAttacks[0];

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical': return "var(--accent-red)";
      case 'high': return "var(--accent-orange)";
      case 'medium': return "#fbbf24";
      case 'low': return "var(--accent-green)";
      default: return "var(--text-muted)";
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "32px" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🛰️</span>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Ataque de Rede (IDS)
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: '8px' }}>
            Monitore o tráfego do sistema e responda a incidentes em tempo real.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
          {/* Main Terminal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              id="terminal-container"
              style={{
                background: "#0d0f17",
                borderRadius: "12px",
                padding: "24px",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "14px",
                color: "var(--accent-cyan)",
                height: "460px",
                overflowY: "auto",
                border: "1px solid var(--border-subtle)",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
                lineHeight: '1.6'
              }}>
              <div style={{ borderBottom: "1px solid rgba(0,212,255,0.1)", paddingBottom: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                <span style={{ color: "var(--text-muted)", fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}>IDS LIVE MONITOR v4.0</span>
                <span className="blink" style={{ fontSize: '11px', color: 'var(--accent-red)', fontWeight: 800 }}>● ACESSO REMOTO DETECTADO</span>
              </div>

              {visibleLogs.map((log, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  style={{ marginBottom: "8px" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>[{new Date().toLocaleTimeString()}]</span> {log}
                </motion.div>
              ))}

              <AnimatePresence>
                {visibleLogs.length < currentAttack.logs.length && (
                  <motion.div
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--accent-cyan)' }}
                  />
                )}
              </AnimatePresence>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                disabled={!!result}
                onClick={() => handleAction('block')}
                className="btn-cyber btn-danger"
                style={{ flex: 1, padding: '16px', fontSize: '15px' }}
              >
                BLOQUEAR IP
              </button>
              <button
                disabled={!!result}
                onClick={() => handleAction('monitor')}
                className="btn-cyber"
                style={{ flex: 1, padding: '16px', fontSize: '15px', background: '#fbbf24', color: 'black', border: 'none' }}
              >
                MONITORAR
              </button>
              <button
                disabled={!!result}
                onClick={() => handleAction('ignore')}
                className="btn-cyber btn-ghost"
                style={{ flex: 1, padding: '16px', fontSize: '15px' }}
              >
                IGNORAR
              </button>
            </div>
          </div>

          {/* Incident Data */}
          <div>
            <div className="card" style={{ padding: "24px", marginBottom: '20px' }}>
              <h3 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Dados do Alerta</h3>

              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, display: 'block', marginBottom: '4px' }}>IP DE ORIGEM</label>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", fontFamily: 'var(--font-mono)' }}>{currentAttack.ip}</div>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, display: 'block', marginBottom: '4px' }}>SEVERIDADE</label>
                  <div style={{
                    color: getSeverityColor(currentAttack.severity),
                    fontWeight: 900,
                    fontSize: "15px",
                    textTransform: "uppercase"
                  }}>
                    {currentAttack.severity}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, display: 'block', marginBottom: '4px' }}>TIPO DE ATAQUE</label>
                  <div style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: '14px' }}>{currentAttack.type.toUpperCase().replace('-', ' ')}</div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: "24px",
                    borderRadius: "12px",
                    background: result.success ? "rgba(0, 255, 136, 0.05)" : "rgba(255, 68, 68, 0.05)",
                    border: `1px solid ${result.success ? "rgba(0, 255, 136, 0.2)" : "rgba(255, 68, 68, 0.2)"}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{result.success ? "✅" : "❌"}</span>
                    <h4 style={{ fontWeight: 800, color: result.success ? "var(--accent-green)" : "var(--accent-red)" }}>
                      {result.success ? "SISTEMA PROTEGIDO" : "RISCO DETECTADO"}
                    </h4>
                  </div>
                  <p style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--text-secondary)" }}>{result.analysis}</p>

                  <button
                    className="btn-cyber btn-primary"
                    onClick={nextAttack}
                    style={{ marginTop: "20px", width: "100%", justifyContent: "center" }}
                  >
                    Próximo Incidente →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </AppLayout>
  );
}
