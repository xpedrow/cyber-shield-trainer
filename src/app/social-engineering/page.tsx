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

const fallbackScenarios: Scenario[] = [
  {
    id: 'it-support-password',
    title: 'Suporte Técnico Falso',
    message: 'Sou do suporte técnico da empresa. Precisamos da sua senha para atualizar o sistema de segurança do seu departamento remotamente.',
    sender: 'Suporte Interno (via Teams)',
    channel: 'Chat',
    options: [
      {
        id: 'give-password',
        text: 'fornecer senha',
        isCorrect: false,
        impact: 'Acesso total concedido ao atacante. Suas credenciais podem ser usadas para exfiltrar dados da empresa.',
      },
      {
        id: 'refuse',
        text: 'recusar',
        isCorrect: true,
        impact: 'Ataque interrompido. Você protegeu suas credenciais e os ativos da empresa.',
      },
      {
        id: 'verify',
        text: 'pedir verificação',
        isCorrect: true,
        impact: 'Melhor prática. Ao solicitar um ticket oficial, você desmascara o golpista sem ser rude.',
      },
    ],
    analysis: 'O suporte técnico NUNCA solicita sua senha por chat ou telefone. Eles possuem ferramentas para gerenciar seu acesso sem precisar da sua credencial privada.',
  },
  {
    id: 'delivery-sms',
    title: 'Problema na Entrega',
    message: 'Seu pacote de R$ 1.250,00 foi retido na alfândega. Pague a taxa de R$ 25,00 para liberação imediata em: bit.ly/correios-taxa-express',
    sender: 'Correios-Info',
    channel: 'SMS',
    options: [
      {
        id: 'click-link',
        text: 'Clicar no link e pagar',
        isCorrect: false,
        impact: 'Dados do cartão de crédito roubados. Você acaba de cair em um golpe de Smishing.',
      },
      {
        id: 'ignore-report',
        text: 'Denunciar e bloquear',
        isCorrect: true,
        impact: 'Telefone do atacante bloqueado. Você evitou prejuízo financeiro.',
      }
    ],
    analysis: 'Órgãos oficiais e grandes e-commerces não pedem pagamentos via links encurtados em SMS. Sempre verifique o rastreamento no site oficial.',
  },
  {
    id: 'hr-benefits-update',
    title: 'Atualização de Benefícios',
    message: 'Olá! Estamos atualizando o sistema de benefícios da empresa. Precisamos que você confirme seu CPF e senha do portal interno para manter seu plano ativo.',
    sender: 'RH Corporativo',
    channel: 'Email',
    options: [
      {
        id: 'send-data',
        text: 'Enviar informações solicitadas',
        isCorrect: false,
        impact: 'Dados pessoais comprometidos. O atacante pode usar seu CPF e credenciais para roubo de identidade.',
      },
      {
        id: 'ignore',
        text: 'Ignorar mensagem',
        isCorrect: true,
        impact: 'Você evitou compartilhar dados sensíveis com um possível golpista.',
      },
      {
        id: 'verify-hr',
        text: 'Confirmar diretamente com o RH',
        isCorrect: true,
        impact: 'Boa prática. Verificar com o departamento oficial evita cair em ataques de engenharia social.',
      },
    ],
    analysis: 'Departamentos internos raramente pedem senha ou dados confidenciais por e-mail. Sempre confirme solicitações sensíveis por canais oficiais.',
  },
  {
    id: 'bank-call-verification',
    title: 'Ligação do Banco',
    message: 'Olá, aqui é do departamento antifraude do seu banco. Detectamos uma transação suspeita e precisamos confirmar seu número completo do cartão e código de segurança.',
    sender: 'Central Antifraude',
    channel: 'Telefone',
    options: [
      {
        id: 'give-card',
        text: 'Informar dados do cartão',
        isCorrect: false,
        impact: 'Fraude financeira imediata. O atacante agora possui todas as informações para realizar compras.',
      },
      {
        id: 'hang-up',
        text: 'Encerrar ligação',
        isCorrect: true,
        impact: 'Você evitou fornecer informações sensíveis.',
      },
      {
        id: 'call-bank',
        text: 'Ligar para o banco pelo número oficial',
        isCorrect: true,
        impact: 'Melhor prática. Confirmar diretamente com o banco elimina o risco de golpe.',
      },
    ],
    analysis: 'Bancos não solicitam dados completos do cartão ou código de segurança por telefone. Sempre ligue para o número oficial do banco.',
  },
  {
    id: 'shared-drive-access',
    title: 'Arquivo Compartilhado Suspeito',
    message: 'Um colega compartilhou um documento urgente com você: "Planilha_Salarios_Atualizada.xlsm". Faça login para visualizar.',
    sender: 'Drive Notification',
    channel: 'Email',
    options: [
      {
        id: 'open-file',
        text: 'Abrir arquivo imediatamente',
        isCorrect: false,
        impact: 'Possível malware executado. Sua máquina pode ter sido comprometida.',
      },
      {
        id: 'verify-sender',
        text: 'Confirmar com o colega se ele enviou',
        isCorrect: true,
        impact: 'Você evitou abrir um arquivo potencialmente malicioso.',
      },
      {
        id: 'scan-file',
        text: 'Baixar e analisar com antivírus',
        isCorrect: true,
        impact: 'Boa prática de segurança antes de abrir arquivos desconhecidos.',
      },
    ],
    analysis: 'Arquivos com macros (.xlsm) são frequentemente usados para distribuir malware. Sempre confirme a origem antes de abrir.',
  },
  {
    id: 'wifi-login-portal',
    title: 'Portal de Wi-Fi Falso',
    message: 'Você se conecta a um Wi-Fi público e aparece uma página solicitando login com e-mail corporativo para liberar acesso à internet.',
    sender: 'Portal Wi-Fi Gratuito',
    channel: 'Web Portal',
    options: [
      {
        id: 'enter-email-password',
        text: 'Inserir e-mail e senha corporativa',
        isCorrect: false,
        impact: 'Credenciais corporativas comprometidas. O atacante agora pode acessar sistemas internos.',
      },
      {
        id: 'disconnect',
        text: 'Desconectar da rede',
        isCorrect: true,
        impact: 'Você evitou um portal de captura de credenciais.',
      },
      {
        id: 'use-vpn',
        text: 'Usar VPN e verificar legitimidade da rede',
        isCorrect: true,
        impact: 'Boa prática para proteger dados em redes públicas.',
      },
    ],
    analysis: 'Portais falsos de Wi-Fi são usados para capturar credenciais. Redes públicas raramente exigem login corporativo.',
  },
  {
    id: 'ceo-urgent-transfer',
    title: 'Fraude do CEO',
    message: 'Olá, estou em uma reunião externa e preciso que você faça uma transferência urgente para um fornecedor. É confidencial, não avise ninguém.',
    sender: 'CEO da Empresa',
    channel: 'Email',
    options: [
      {
        id: 'send-money',
        text: 'Realizar transferência imediatamente',
        isCorrect: false,
        impact: 'Golpe bem-sucedido. A empresa perde dinheiro em uma fraude conhecida como Business Email Compromise.',
      },
      {
        id: 'verify-ceo',
        text: 'Confirmar diretamente com o CEO',
        isCorrect: true,
        impact: 'Você impediu uma tentativa de fraude corporativa.',
      },
      {
        id: 'report-security',
        text: 'Reportar ao time de segurança',
        isCorrect: true,
        impact: 'A equipe de segurança pode investigar e bloquear o atacante.',
      },
    ],
    analysis: 'Ataques de "CEO Fraud" usam urgência e autoridade para pressionar funcionários. Sempre confirme solicitações financeiras por outro canal.',
  }
];

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
        if (!response.ok) throw new Error("Unauthorized or server error");
        const data = await response.json();
        if (Array.isArray(data)) {
          setScenarios(data);
        } else {
          setScenarios(fallbackScenarios);
        }
      } catch (error) {
        console.error("Error fetching scenarios, using fallbacks:", error);
        setScenarios(fallbackScenarios);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const handleOptionSelect = async (optionId: string) => {
    const scenario = scenarios[currentScenarioIndex];

    // Optimistic UI / Play locally if fetch fails
    const option = scenario.options.find(o => o.id === optionId);
    if (!option) return;

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
      if (result.optionSelected) {
        setSelectedOption(result.optionSelected);
      } else {
        setSelectedOption(option);
      }
      setShowResult(true);
    } catch (error) {
      console.error("Error playing scenario, showing local result:", error);
      setSelectedOption(option);
      setShowResult(true);
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
          <div className="loading-bar" style={{ width: '200px', margin: '20px auto' }}></div>
          Carregando cenários...
        </div>
      </AppLayout>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex] || fallbackScenarios[0];

  return (
    <AppLayout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "32px", textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🕵️</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Engenharia Social
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Identifique manipulações e proteja informações críticas.
          </p>
        </header>

        <div style={{ display: "grid", gap: "24px" }}>
          {/* Simulation Card */}
          <div className="card" style={{ overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              padding: '12px 20px',
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }}></span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {currentScenario.channel} • {currentScenario.sender}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {currentScenario.id}</span>
            </div>

            {/* Content */}
            <div style={{ padding: '32px' }}>
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                color: 'var(--text-primary)',
                marginBottom: '32px',
                fontStyle: 'italic',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', top: '-10px', left: '20px', fontSize: '40px', color: 'var(--accent-cyan)', opacity: 0.3 }}>"</span>
                {currentScenario.message}
                <span style={{ position: 'absolute', bottom: '-20px', right: '20px', fontSize: '40px', color: 'var(--accent-cyan)', opacity: 0.3 }}>"</span>
              </div>

              {!showResult ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                  {currentScenario.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className="btn-cyber btn-ghost"
                      style={{ padding: '12px 24px', fontSize: '15px' }}
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
                      borderRadius: "12px",
                      background: selectedOption?.isCorrect ? "rgba(0, 255, 136, 0.05)" : "rgba(255, 68, 68, 0.05)",
                      border: `1px solid ${selectedOption?.isCorrect ? "rgba(0, 255, 136, 0.2)" : "rgba(255, 68, 68, 0.2)"}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div style={{
                        padding: "4px 12px",
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 800,
                        backgroundColor: selectedOption?.isCorrect ? "var(--accent-green)" : "var(--accent-red)",
                        color: "black"
                      }}>
                        {selectedOption?.isCorrect ? "DECISÃO SEGURA" : "DECISÃO DE RISCO"}
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {selectedOption?.isCorrect ? "Mandou bem!" : "Cuidado!"}
                      </h3>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        <strong style={{ color: "var(--text-primary)" }}>Impacto:</strong> {selectedOption?.impact}
                      </p>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "16px" }}>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        <strong style={{ color: "var(--accent-cyan)" }}>Análise Especialista:</strong> {currentScenario.analysis}
                      </p>
                    </div>

                    <button
                      className="btn-cyber btn-primary"
                      onClick={nextScenario}
                      style={{ marginTop: "24px", width: '100%', justifyContent: 'center' }}
                    >
                      Próximo Cenário →
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
