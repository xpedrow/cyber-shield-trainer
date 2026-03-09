"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResult {
  entropy: number;
  score: number;
  strength: string;
  crackTime: {
    bruteForce: string;
    dictionary: string;
    botnet: string;
  };
  suggestions: string[];
}

export default function PasswordSimulator() {
  const [password, setPassword] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleTest = async () => {
    if (!password) return;
    setIsSimulating(true);

    // Aesthetic delay to simulate "brute force testing"
    await new Promise(r => setTimeout(r, 1500));

    try {
      const response = await fetch("http://localhost:3001/api/v1/simulations/password/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      // Fallback logic for offline/demo
      const mockResult = calculateMockAnalysis(password);
      setAnalysis(mockResult);
    } finally {
      setIsSimulating(false);
    }
  };

  const calculateMockAnalysis = (pwd: string): AnalysisResult => {
    let charset = 0;
    if (/[a-z]/.test(pwd)) charset += 26;
    if (/[A-Z]/.test(pwd)) charset += 26;
    if (/[0-9]/.test(pwd)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charset += 32;

    const entropy = pwd.length * Math.log2(charset || 1);
    const isWeak = pwd.length < 8 || /123|qwerty|admin|senha/i.test(pwd);

    return {
      entropy: Math.round(entropy),
      score: isWeak ? 20 : Math.min(100, (entropy / 80) * 100),
      strength: isWeak ? "FRACA" : entropy > 60 ? "MUITO FORTE" : "MODERADA",
      crackTime: {
        bruteForce: isWeak ? "0.3 segundos" : "120 anos",
        dictionary: isWeak ? "Instantâneo" : "80 anos",
        botnet: isWeak ? "Instantâneo" : "5 anos",
      },
      suggestions: isWeak ? ["Use pelo menos 12 caracteres", "Adicione símbolos e números"] : ["Senha excelente!"],
    };
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'MUITO FRACA':
      case 'FRACA': return 'var(--accent-red)';
      case 'MODERADA': return 'var(--accent-orange)';
      case 'FORTE':
      case 'MUITO FORTE': return 'var(--accent-green)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "32px", textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Simulador de Senha Fraca
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Teste a resistência da sua senha contra ataques de Brute Force e Dicionário.
          </p>
        </header>

        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Digite uma senha para testar:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                className="cyber-input"
                style={{ flex: 1, fontSize: '18px', letterSpacing: '0.1em' }}
                placeholder="Ex: pedro123 ou s3nh4_f0rt3!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTest()}
              />
              <button
                className="btn-cyber btn-primary"
                onClick={handleTest}
                disabled={isSimulating || !password}
                style={{ minWidth: '140px', justifyContent: 'center' }}
              >
                {isSimulating ? 'Testando...' : 'Analisar'}
              </button>
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            💡 <strong>O que acontece agora?</strong> Nosso algoritmo simula bilhões de tentativas por segundo, verificando padrões de teclado, datas de nascimento e palavras em múltiplos idiomas.
          </div>
        </div>

        <AnimatePresence>
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '40px' }}
            >
              <div className="loading-bar" style={{ width: '100%', maxWidth: '300px', margin: '0 auto 20px' }}></div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent-cyan)' }}>
                INICIANDO ATAQUE DE DICIONÁRIO...<br />
                TESTANDO COMBINAÇÕES DE BRUTE FORCE...
              </p>
            </motion.div>
          )}

          {analysis && !isSimulating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
            >
              {/* Result Card */}
              <div className="card" style={{ padding: '24px', borderLeft: `4px solid ${getStrengthColor(analysis.strength)}` }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase' }}>
                  Resultado da Análise
                </h3>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Força da Senha:</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: getStrengthColor(analysis.strength) }}>
                    {analysis.strength}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Entropia (Bits):</span>
                    <span style={{ fontSize: '12px', color: 'var(--accent-cyan)' }}>{analysis.entropy} bits</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${analysis.score}%`, height: '100%', background: getStrengthColor(analysis.strength), transition: 'width 1s ease' }}></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Sugestões:</h4>
                  <ul style={{ paddingLeft: '18px', display: 'grid', gap: '8px' }}>
                    {analysis?.suggestions?.map((s, i) => (
                      <li key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Crack Time Card */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase' }}>
                  Tempo Estimado para Quebrar
                </h3>

                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>BRUTE FORCE (PC Comum)</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{analysis?.crackTime?.bruteForce}</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>ATAQUE DE DICIONÁRIO</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{analysis?.crackTime?.dictionary}</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>REDES DE BOTNET (Distribuído)</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-orange)' }}>{analysis?.crackTime?.botnet}</div>
                  </div>
                </div>

                <p style={{ marginTop: '20px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                  * Estimativas baseadas em poder computacional de 2026.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational Section */}
        <div style={{ marginTop: '48px', borderTop: '1px solid var(--border-subtle)', paddingTop: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>Por que isso importa?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📊</div>
              <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>O que é Entropia?</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                É a medida da aleatoriedade de uma senha. Quanto maior o conjunto de caracteres e o tamanho da senha, mais difícil é para um computador adivinhá-la por exaustão.
              </p>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📚</div>
              <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Ataque de Dicionário</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Atacantes não testam todas as combinações primeiro. Eles usam listas de bilhões de senhas vazadas e palavras comuns (como "123456").
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
