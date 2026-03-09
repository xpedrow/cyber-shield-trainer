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
}

export default function NetworkAttackPage() {
  const [attacks, setAttacks] = useState<NetworkAttack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchAttacks = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/v1/simulations/network/attacks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setAttacks(data);
      } catch (error) {
        console.error("Error fetching attacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttacks();
  }, []);

  const handleAction = async (action: 'block' | 'monitor' | 'ignore') => {
    const attack = attacks[currentIndex];
    try {
      const response = await fetch("http://localhost:3001/api/v1/simulations/network/handle", {
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
      setResult(data);
    } catch (error) {
      console.error("Error handling attack:", error);
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
          Carregando simulador de rede...
        </div>
      </AppLayout>
    );
  }

  const currentAttack = attacks[currentIndex];

  if (!currentAttack) {
    return (
      <AppLayout>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Nenhuma simulação disponível.
        </div>
      </AppLayout>
    );
  }

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'critical': return "#ef4444";
      case 'high': return "#f97316";
      case 'medium': return "#eab308";
      case 'low': return "#3b82f6";
      default: return "#6b7280";
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Simulador de Ataque de Rede
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            Analise os logs do sistema e tome decisões rápidas para proteger a infraestrutura.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "24px" }}>
          {/* Main Monitor Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{
              background: "#0f172a",
              borderRadius: "12px",
              padding: "24px",
              fontFamily: "'Fira Code', 'Courier New', monospace",
              fontSize: "0.9rem",
              color: "#38bdf8",
              height: "450px",
              overflowY: "auto",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
              border: "1px solid #1e293b"
            }}>
              <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: "10px", marginBottom: "16px", color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
                <span>CENTRAL LOG ANALYTICS</span>
                <span className="blink">● LIVE</span>
              </div>
              {currentAttack.logs.map((log, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  style={{ marginBottom: "8px", lineHeight: "1.4" }}
                >
                  <span style={{ color: "#475569" }}>[{new Date().toLocaleTimeString()}]</span> {log}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ width: "8px", height: "16px", background: "#38bdf8", display: "inline-block", marginLeft: "4px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                disabled={!!result}
                onClick={() => handleAction('block')}
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  fontWeight: 700,
                  cursor: !!result ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                BLOQUEAR IP
              </button>
              <button
                disabled={!!result}
                onClick={() => handleAction('monitor')}
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#eab308",
                  color: "white",
                  border: "none",
                  fontWeight: 700,
                  cursor: !!result ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                MONITORAR
              </button>
              <button
                disabled={!!result}
                onClick={() => handleAction('ignore')}
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "12px",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                  fontWeight: 700,
                  cursor: !!result ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                IGNORAR
              </button>
            </div>
          </div>

          {/* Sidebar Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{
              background: "var(--bg-secondary)",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid var(--border-subtle)"
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Info do Incidente</h3>
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>IP ORIGEM</label>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{currentAttack.ip}</div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>SEVERIDADE</label>
                  <div style={{
                    color: getSeverityColor(currentAttack.severity),
                    fontWeight: 800,
                    textTransform: "uppercase"
                  }}>
                    {currentAttack.severity}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>TIPO</label>
                  <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>{currentAttack.type}</div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: result.success ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    padding: "24px",
                    borderRadius: "16px",
                    border: `1px solid ${result.success ? "#10b981" : "#ef4444"}`
                  }}
                >
                  <h4 style={{ fontWeight: 800, marginBottom: "8px", color: result.success ? "#059669" : "#dc2626" }}>
                    {result.success ? "DISPOSITIVO PROTEGIDO" : "SISTEMA COMPROMETIDO"}
                  </h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: "1.5", color: "var(--text-primary)" }}>{result.analysis}</p>
                  
                  <button
                    onClick={nextAttack}
                    style={{
                      marginTop: "16px",
                      width: "100%",
                      padding: "10px",
                      background: "var(--text-primary)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Próximo Alerta
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blink {
          animation: blink 1s infinite;
          color: #ef4444;
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </AppLayout>
  );
}
