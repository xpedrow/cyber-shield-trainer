"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import AppLayout from "@/components/AppLayout";

import { motion, AnimatePresence } from "framer-motion";

interface SqlInjectionScenario {
  id: string;
  vulnerableQuery: string;
  description: string;
  hints: string[];
  correctInjection: string;
  explanation: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export default function SqlInjectionPage() {
  const [scenarios, setScenarios] = useState<SqlInjectionScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<SqlInjectionScenario | null>(null);
  const [injection, setInjection] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await apiFetch("simulations/sql-injection/scenarios", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setScenarios(data);
      }
    } catch (error) {
      console.error('Erro ao carregar cenários:', error);
    }
  };

  const testInjection = async () => {
    if (!selectedScenario || !injection.trim()) return;

    setLoading(true);
    setFeedback('');
    setResult(null);
    setShowResult(false);
    setAttempts(prev => prev + 1);

    try {
      const response = await apiFetch("simulations/sql-injection/test", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          injection: injection.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback);
        setResult(data.simulatedResult);
        setShowResult(true);

        if (data.successful && !completed.includes(selectedScenario.id)) {
          setCompleted([...completed, selectedScenario.id]);
          setScore(prev => prev + 75);
        } else if (!data.successful) {
          setScore(prev => prev + 5);
        }
      }
    } catch (error) {
      console.error('Erro ao testar injeção:', error);
      setFeedback('Erro ao testar a injeção. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetScenario = () => {
    setInjection('');
    setFeedback('');
    setResult(null);
    setShowResult(false);
    setShowHints(false);
    setAttempts(0);
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

  return (
    <AppLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "32px", textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💉</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Simulador de Injeção SQL
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Aprenda sobre vulnerabilidades SQL Injection através de cenários interativos e práticas seguras.
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
          <div className="card" style={{ padding: "20px", textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--accent-orange)" }}>{attempts}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tentativas</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
          {/* Scenario List */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              🎯 Cenários Vulneráveis
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {scenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card ${selectedScenario?.id === scenario.id ? 'ring-2 ring-cyan-400' : ''} ${completed.includes(scenario.id) ? 'border-accent' : ''}`}
                  style={{
                    padding: "16px",
                    cursor: "pointer",
                    borderLeft: `4px solid ${getSeverityColor(scenario.severity)}`,
                    opacity: completed.includes(scenario.id) ? 0.8 : 1,
                    borderColor: completed.includes(scenario.id) ? 'var(--accent-green)' : 'var(--border-subtle)',
                    boxShadow: selectedScenario?.id === scenario.id ? 'var(--glow-cyan)' : 'none'
                  }}
                  onClick={() => {
                    setSelectedScenario(scenario);
                    resetScenario();
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: getSeverityColor(scenario.severity), fontWeight: 600 }}>
                      {getSeverityIcon(scenario.severity)} {scenario.severity}
                    </span>
                    {completed.includes(scenario.id) && (
                      <span style={{ color: "var(--accent-green)", fontSize: "16px" }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.4 }}>
                    {scenario.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Injection Testing Area */}
          <div>
            {selectedScenario ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: "20px" }}
              >
                {/* Scenario Details */}
                <div className="card" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${getSeverityColor(selectedScenario.severity)}, ${getSeverityColor(selectedScenario.severity)}dd)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px"
                    }}>
                      💉
                    </div>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                        Cenário Vulnerável
                      </h3>
                      <span style={{
                        fontSize: "12px",
                        color: getSeverityColor(selectedScenario.severity),
                        fontWeight: 600,
                        background: "rgba(255,255,255,0.05)",
                        padding: "4px 8px",
                        borderRadius: "12px"
                      }}>
                        {getSeverityIcon(selectedScenario.severity)} {selectedScenario.severity}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5, marginBottom: "20px" }}>
                    {selectedScenario.description}
                  </p>

                  {/* Vulnerable Query */}
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      📝 Query Vulnerável
                    </h4>
                    <div style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "16px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      overflowX: "auto"
                    }}>
                      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                        {selectedScenario.vulnerableQuery.replace(/\[(.*?)\]/g, (match, content) => {
                          return `[${content}]`;
                        })}
                      </pre>
                    </div>
                  </div>

                  {/* Hints */}
                  <div style={{ marginTop: "20px" }}>
                    <button
                      onClick={() => setShowHints(!showHints)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--accent-cyan)",
                        fontSize: "14px",
                        fontWeight: 600,
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      <span>{showHints ? '🔽' : '🔼'}</span>
                      <span>{showHints ? 'Ocultar' : 'Mostrar'} Dicas ({selectedScenario.hints.length})</span>
                    </button>

                    <AnimatePresence>
                      {showHints && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}
                        >
                          {selectedScenario.hints.map((hint, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              style={{
                                padding: "12px",
                                background: "rgba(0,212,255,0.05)",
                                border: "1px solid rgba(0,212,255,0.2)",
                                borderRadius: "8px",
                                fontSize: "13px",
                                color: "var(--text-secondary)",
                                lineHeight: 1.4
                              }}
                            >
                              💡 {hint}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Injection Input */}
                <div className="card" style={{ padding: "24px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    ⚡ Teste sua Injeção SQL
                  </h4>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                      Digite sua tentativa de injeção:
                    </label>
                    <textarea
                      value={injection}
                      onChange={(e) => setInjection(e.target.value)}
                      placeholder="Ex: ' OR '1'='1' --"
                      style={{
                        width: "100%",
                        height: "80px",
                        padding: "12px",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        resize: "none"
                      }}
                    />
                  </div>

                  <button
                    onClick={testInjection}
                    disabled={!injection.trim() || loading}
                    className="btn-cyber btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                  >
                    {loading ? 'Testando...' : '🚀 Testar Injeção'}
                  </button>
                </div>

                {/* Results Section */}
                <AnimatePresence>
                  {showResult && (
                    <div className="cyber-card" style={{ padding: "24px", marginTop: "24px" }}>
                      {/* Feedback */}
                      {feedback && (
                        <div style={{
                          padding: "16px",
                          borderRadius: "12px",
                          background: feedback.includes('bem-sucedida') ? "rgba(0, 255, 136, 0.05)" : "rgba(255, 140, 0, 0.05)",
                          border: `1px solid ${feedback.includes('bem-sucedida') ? "var(--accent-green)" : "var(--accent-orange)"}`,
                          marginBottom: "20px"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <span>{feedback.includes('bem-sucedida') ? '✅' : '⚠️'}</span>
                            <span style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                              {feedback.includes('bem-sucedida') ? 'Injeção Bem-Sucedida!' : 'Resultado do Teste'}
                            </span>
                          </div>
                          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{feedback}</p>
                        </div>
                      )}

                      {/* Simulated Results */}
                      {result && (
                        <div style={{ marginBottom: "24px" }}>
                          <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            📊 Resultado do Banco de Dados
                          </h4>
                          <div style={{
                            background: "rgba(0,0,0,0.3)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "10px",
                            padding: "16px",
                            fontSize: "13px",
                            color: "var(--accent-cyan)",
                            fontFamily: "var(--font-mono)",
                            overflowX: "auto"
                          }}>
                            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                              {JSON.stringify(result, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Analysis */}
                      <div>
                        <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          📚 Análise Técnica
                        </h4>
                        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
                          {selectedScenario.explanation}
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
                            <div style={{ fontSize: "11px", color: "var(--accent-cyan)", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" }}>Injeção Correta</div>
                            <div style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "6px" }}>
                              {selectedScenario.correctInjection}
                            </div>
                          </div>
                          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
                            <div style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" }}>Experiência</div>
                            <div style={{ fontSize: "20px", color: "var(--text-primary)", fontWeight: 800 }}>
                              {feedback.includes('bem-sucedida') ? '+75 XP' : '+5 XP'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="card" style={{ padding: "48px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>💉</div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                  Selecione um Cenário
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                  Escolha um cenário vulnerável para praticar suas técnicas de SQL Injection e aprender sobre segurança de aplicações.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Educational Section */}
        <div style={{ marginTop: "48px", borderTop: "1px solid var(--border-subtle)", paddingTop: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "24px", textAlign: "center" }}>Por que isso importa?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ fontSize: "24px", marginBottom: "12px" }}>🛡️</div>
              <h4 style={{ fontWeight: 700, marginBottom: "8px" }}>Prepared Statements</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Use consultas parametrizadas para prevenir injeções SQL. Prepared statements separam o código SQL da entrada do usuário.
              </p>
            </div>
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ fontSize: "24px", marginBottom: "12px" }}>🔍</div>
              <h4 style={{ fontWeight: 700, marginBottom: "8px" }}>Validação de Entrada</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Sempre valide e sanitize a entrada do usuário. Use whitelists de caracteres permitidos e limite o tamanho dos dados.
              </p>
            </div>
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ fontSize: "24px", marginBottom: "12px" }}>📊</div>
              <h4 style={{ fontWeight: 700, marginBottom: "8px" }}>Monitoramento</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Implemente logging de queries e monitoramento de anomalias para detectar tentativas de injeção em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}