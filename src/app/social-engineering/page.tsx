"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  impact: string;
}

interface Scenario {
  id: string;
  title: string;
  message: string;
  sender: string;
  channel: string;
  options: Option[];
  analysis: string;
}

export default function SocialEngineeringPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/v1/simulations/social/scenarios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setScenarios(data);
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const handleOptionSelect = async (optionId: string) => {
    const scenario = scenarios[currentScenarioIndex];
    try {
      const response = await fetch("http://localhost:3001/api/v1/simulations/social/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          scenarioId: scenario.id,
          optionId,
        }),
      });
      const result = await response.json();
      setSelectedOption(result.optionSelected);
      setShowResult(true);
    } catch (error) {
      console.error("Error playing scenario:", error);
    }
  };

  const nextScenario = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentScenarioIndex((prev) => (prev + 1) % scenarios.length);
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Carregando cenários...
        </div>
      </AppLayout>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];

  if (!currentScenario) {
    return (
      <AppLayout>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Nenhum cenário disponível.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
            Simulação de Engenharia Social
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            Mantenha-se vigilante. Cibercriminosos usam manipulação psicológica para roubar dados.
          </p>
        </header>

        <div style={{ display: "grid", gap: "30px" }}>
          {/* Channel Header */}
          <div style={{
            background: "var(--bg-secondary)",
            padding: "16px 24px",
            borderRadius: "16px",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#10b981"
            }} />
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              Canal: {currentScenario.channel}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginLeft: "auto" }}>
              Origem: {currentScenario.sender}
            </span>
          </div>

          {/* Message Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentScenario.id}
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "24px",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
              color: "#1f2937",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{
              fontSize: "1.25rem",
              lineHeight: "1.6",
              fontWeight: 500,
              fontStyle: "italic",
              marginBottom: "30px",
              position: "relative",
              zIndex: 1
            }}>
              "{currentScenario.message}"
            </div>

            {!showResult ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {currentScenario.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className="premium-button"
                    style={{
                      padding: "12px 24px",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: "24px",
                    borderRadius: "16px",
                    backgroundColor: selectedOption?.isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    border: `1px solid ${selectedOption?.isCorrect ? "#10b981" : "#ef4444"}`,
                    marginTop: "20px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      backgroundColor: selectedOption?.isCorrect ? "#10b981" : "#ef4444",
                      color: "white"
                    }}>
                      {selectedOption?.isCorrect ? "CORRETO" : "VULNERÁVEL"}
                    </div>
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Impacto da Decisão:</h3>
                  <p style={{ lineHeight: "1.5", marginBottom: "20px" }}>{selectedOption?.impact}</p>
                  
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "16px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Análise do Ataque:</h3>
                    <p style={{ lineHeight: "1.5" }}>{currentScenario.analysis}</p>
                  </div>

                  <button
                    onClick={nextScenario}
                    style={{
                      marginTop: "24px",
                      padding: "10px 20px",
                      background: "var(--text-primary)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Próximo Cenário
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .premium-button {
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }
        .premium-button:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
      `}</style>
    </AppLayout>
  );
}
