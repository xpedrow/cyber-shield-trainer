"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";

interface InsiderThreat {
  id: string;
  type: 'data-leak' | 'unauthorized-access' | 'policy-violation';
  description: string;
  evidence: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  correctAction: 'investigate' | 'block-access' | 'report' | 'monitor';
  explanation: string;
}


export default function InsiderThreatPage() {
  const [threats, setThreats] = useState<InsiderThreat[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<InsiderThreat | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    fetchThreats();
  }, []);

  const fetchThreats = async () => {
    try {
      const response = await apiFetch("simulations/insider-threat/threats", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setThreats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar ameaças:', error);
    }
  };

  const handleAction = async () => {
    if (!selectedThreat || !selectedAction) return;

    setLoading(true);
    try {
      const response = await apiFetch("simulations/insider-threat/handle", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          threatId: selectedThreat.id,
          action: selectedAction
        })
      });

      if (response.ok) {
        const result = await response.json();
        setFeedback(result.feedback);
        setScore(prev => prev + (result.success ? 50 : 10));
        if (result.success && !completed.includes(selectedThreat.id)) {
          setCompleted([...completed, selectedThreat.id]);
        }
        setShowAnalysis(true);
      }
    } catch (error) {
      console.error('Erro ao processar ação:', error);
      setFeedback('Erro ao processar a ação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetScenario = () => {
    setSelectedAction('');
    setFeedback('');
    setShowAnalysis(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'var(--accent-green)';
      case 'MEDIUM': return 'var(--accent-orange)';
      case 'HIGH': return 'var(--accent-red)';
      case 'CRITICAL': return 'var(--accent-red)';
      default: return 'var(--text-muted)';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'LOW': return '🟢';
      case 'MEDIUM': return '🟡';
      case 'HIGH': return '🟠';
      case 'CRITICAL': return '🔴';
      default: return '⚪';
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'data-leak': return '🔓';
      case 'unauthorized-access': return '🚫';
      case 'policy-violation': return '⚠️';
      default: return '🕵️';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'investigate': return 'Investigar';
      case 'block-access': return 'Bloquear Acesso';
      case 'report': return 'Reportar';
      case 'monitor': return 'Monitorar';
      default: return action;
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "32px", textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🕵️</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Simulador de Ameaça Interna
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Identifique e responda a ameaças que vêm de dentro da organização através de cenários realistas.
          </p>
        </header>

        {/* Stats Display */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "32px" }}>
          <div className="card" style={{ padding: "20px", textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--accent-cyan)" }}>{score}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pontos</div>
          </div>
          <div className="card" style={{ padding: "20px", textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--accent-green)" }}>{completed.length}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Completados</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
          {/* Threat List */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              🎯 Cenários de Ameaça
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {threats.map((threat, index) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card ${selectedThreat?.id === threat.id ? 'ring-2 ring-cyan-400' : ''} ${completed.includes(threat.id) ? 'border-green-400' : ''}`}
                  style={{
                    padding: "16px",
                    cursor: "pointer",
                    borderLeft: `4px solid ${getSeverityColor(threat.severity)}`,
                    opacity: completed.includes(threat.id) ? 0.8 : 1
                  }}
                  onClick={() => {
                    setSelectedThreat(threat);
                    resetScenario();
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: getSeverityColor(threat.severity), fontWeight: 600 }}>
                      {getSeverityIcon(threat.severity)} {threat.severity}
                    </span>
                    {completed.includes(threat.id) && (
                      <span style={{ color: "var(--accent-green)", fontSize: "16px" }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontSize: "16px", marginBottom: "8px" }}>
                    {getThreatIcon(threat.type)}
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.4 }}>
                    {threat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Threat Response Area */}
          <div>
            {selectedThreat ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: "20px" }}
              >
                {/* Threat Details */}
                <div className="card" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${getSeverityColor(selectedThreat.severity)}, ${getSeverityColor(selectedThreat.severity)}dd)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px"
                    }}>
                      {getThreatIcon(selectedThreat.type)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                        Cenário de Ameaça
                      </h3>
                      <span style={{
                        fontSize: "12px",
                        color: getSeverityColor(selectedThreat.severity),
                        fontWeight: 600,
                        background: "rgba(255,255,255,0.05)",
                        padding: "4px 8px",
                        borderRadius: "12px"
                      }}>
                        {getSeverityIcon(selectedThreat.severity)} {selectedThreat.severity}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5, marginBottom: "20px" }}>
                    {selectedThreat.description}
                  </p>

                  {/* Evidence */}
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      📋 Evidências Identificadas
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {selectedThreat.evidence.map((evidence, index) => (
                        <div key={index} style={{
                          padding: "12px",
                          background: "rgba(0,0,0,0.2)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.4
                        }}>
                          • {evidence}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Selection */}
                <div className="card" style={{ padding: "24px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    🛡️ Escolha sua Resposta
                  </h4>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                      Qual ação você tomaria diante desta ameaça?
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {['investigate', 'block-access', 'report', 'monitor'].map((action) => (
                        <button
                          key={action}
                          onClick={() => setSelectedAction(action)}
                          style={{
                            padding: "12px",
                            border: `2px solid ${selectedAction === action ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                            borderRadius: "8px",
                            background: selectedAction === action ? "rgba(0,212,255,0.1)" : "rgba(0,0,0,0.2)",
                            color: "var(--text-primary)",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.2s ease"
                          }}
                        >
                          {getActionLabel(action)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAction}
                    disabled={!selectedAction || loading}
                    className="btn-cyber btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                  >
                    {loading ? 'Processando...' : '🚀 Executar Ação'}
                  </button>
                </div>

              {/* Feedback & Analysis */}
              <AnimatePresence>
                {feedback && (
                  <div style={{
                    padding: "16px",
                    borderRadius: "12px",
                    background: feedback.includes('correta') ? "rgba(0, 255, 136, 0.05)" : "rgba(255, 68, 68, 0.05)",
                    border: `1px solid ${feedback.includes('correta') ? "var(--accent-green)" : "var(--accent-red)"}`,
                    marginBottom: "16px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span>{feedback.includes('correta') ? '✅' : '❌'}</span>
                      <span style={{ fontWeight: 800, color: feedback.includes('correta') ? "var(--accent-green)" : "var(--accent-red)" }}>
                        {feedback.includes('correta') ? 'Ação Correta!' : 'Ação Incorreta'}
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-secondary)" }}>{feedback}</p>
                  </div>
                )}
              </AnimatePresence>

              {/* Analysis Section */}
              {showAnalysis && (
                <div style={{
                  padding: "24px",
                  borderRadius: "12px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-accent)",
                  marginTop: "16px"
                }}>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>📊</span>
                    Análise da Situação
                  </h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                    {selectedThreat.explanation}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ fontSize: "12px", color: "var(--accent-cyan)", fontWeight: 700, marginBottom: "4px" }}>Ação Recomendada</div>
                      <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>{getActionLabel(selectedThreat.correctAction)}</div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ fontSize: "12px", color: "var(--accent-green)", fontWeight: 700, marginBottom: "4px" }}>Pontos Ganhos</div>
                      <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                        {feedback.includes('correta') ? '+50 XP' : '+10 XP'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="cyber-card" style={{ padding: "60px", textAlign: "center", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.03)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <span style={{ fontSize: "40px" }}>🎯</span>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
                Selecione um Cenário
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px", maxWidth: "400px", lineHeight: 1.6 }}>
                Escolha uma ameaça interna da lista para começar a simulação e praticar suas habilidades de resposta a incidentes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Footer */}
      <div style={{ marginTop: "60px", padding: "32px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>📚</span>
          Sobre Ameaças Internas
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px" }}>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-cyan)", marginBottom: "12px", textTransform: "uppercase" }}>Principais Riscos</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Vazamento de dados confidenciais</li>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Acesso não autorizado a sistemas</li>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Violações de políticas de segurança</li>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Uso indevido de recursos corporativos</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-cyan)", marginBottom: "12px", textTransform: "uppercase" }}>Prevenção</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Controle rigoroso de acesso (RBAC)</li>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Monitoramento contínuo de logs</li>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Treinamento regular de segurança</li>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Políticas claras de uso aceitável</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-cyan)", marginBottom: "12px", textTransform: "uppercase" }}>Resposta</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Investigação imediata de incidentes</li>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Isolamento de sistemas comprometidos</li>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Notificação às partes interessadas</li>
              <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>• Aprendizado e melhoria contínua</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}