"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";

interface InsiderThreat {
  id: string;
  type: 'data-leak' | 'unauthorized-access' | 'policy-violation';
  description: string;
  evidence: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  correctAction: 'investigate' | 'block-access' | 'report' | 'monitor';
  explanation: string;
}

const threatIcons = {
  'data-leak': '🔓',
  'unauthorized-access': '🚫',
  'policy-violation': '⚠️'
};

const severityColors = {
  'LOW': 'text-green-400 bg-green-500/20 border-green-500/30',
  'MEDIUM': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  'HIGH': 'text-orange-400 bg-orange-500/20 border-orange-500/30',
  'CRITICAL': 'text-red-400 bg-red-500/20 border-red-500/30'
};

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
      const response = await fetch('http://localhost:3001/api/v1/simulations/insider-threat/threats', {
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
      const response = await fetch('http://localhost:3001/api/v1/simulations/insider-threat/handle', {
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 rounded-lg border-2 mb-4 ${
                      feedback.includes('correta') || feedback.includes('bem-sucedida')
                        ? 'bg-green-500/10 border-green-500/30 text-green-300'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={feedback.includes('correta') ? 'text-green-400' : 'text-red-400'}>
                        {feedback.includes('correta') ? '✅' : '❌'}
                      </span>
                      <span className="font-semibold">
                        {feedback.includes('correta') ? 'Ação Correta!' : 'Ação Incorreta'}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{feedback}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analysis Section */}
              {showAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 rounded-lg p-4 border border-gray-600"
                >
                  <h4 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                    <span className="mr-2">📊</span>
                    Análise da Situação
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {selectedThreat.explanation}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-cyan-400 font-medium mb-1">Ação Recomendada</div>
                      <div className="text-gray-300">{getActionLabel(selectedThreat.correctAction)}</div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-green-400 font-medium mb-1">Pontos Ganhos</div>
                        <div className="text-gray-300">
                          {feedback.includes('correta') ? '+50 XP' : '+10 XP'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  Selecione um Cenário
                </h3>
                <p className="text-gray-400">
                  Escolha uma ameaça interna da lista para começar a simulação e praticar suas habilidades de resposta a incidentes.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Educational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <span className="mr-2">📚</span>
            Sobre Ameaças Internas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-cyan-400 mb-2">Principais Riscos</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Vazamento de dados confidenciais</li>
                <li>• Acesso não autorizado a sistemas</li>
                <li>• Violações de políticas de segurança</li>
                <li>• Uso indevido de recursos corporativos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-cyan-400 mb-2">Prevenção</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Controle rigoroso de acesso (RBAC)</li>
                <li>• Monitoramento contínuo de logs</li>
                <li>• Treinamento regular de segurança</li>
                <li>• Políticas claras de uso aceitável</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-cyan-400 mb-2">Resposta</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Investigação imediata de incidentes</li>
                <li>• Isolamento de sistemas comprometidos</li>
                <li>• Notificação às partes interessadas</li>
                <li>• Aprendizado e melhoria contínua</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}