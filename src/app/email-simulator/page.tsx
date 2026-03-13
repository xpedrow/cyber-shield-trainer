"use client";

import AppLayout from "@/components/AppLayout";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

const emails = [
  {
    id: 1,
    from: "seguranca@bradesco-bank.net",
    fromDisplay: "Bradesco Segurança",
    subject: "⚠️ URGENTE: Sua conta será bloqueada em 24h",
    preview: "Detectamos atividade suspeita. Clique aqui para verificar...",
    time: "09:32",
    isPhishing: true,
    redFlags: [
      "Domínio falso: '@bradesco-bank.net' — o domínio real é '@bradesco.com.br'",
      "Urgência artificial para pressionar a vítima",
      "Link aponta para site diferente do exibido",
      "E-mail não personalizado com seu nome",
    ],
    body: `Prezado(a) Cliente,

Identificamos atividade incomum na sua conta e, por motivos de segurança, precisamos que você confirme seus dados imediatamente.

Caso não complete a verificação em 24 horas, sua conta será BLOQUEADA.

[ VERIFICAR MINHA CONTA AGORA ]

Bradesco – Departamento de Segurança`,
    safeActions: [
      "Não clique em nenhum link do e-mail",
      "Acesse diretamente o site oficial bradesco.com.br",
      "Ligue para o número no verso do seu cartão",
      "Reporte como phishing ao seu provedor de e-mail",
    ],
  },
  {
    id: 2,
    from: "noreply@github.com",
    fromDisplay: "GitHub",
    subject: "[GitHub] A new public key was added to your account",
    preview: "A public key was added to your GitHub account. If you did not...",
    time: "08:14",
    isPhishing: false,
    redFlags: [],
    body: `Hi there,

A new public SSH key was added to your GitHub account.

Key fingerprint: SHA256:...uXcKJh7Qp8...

If you did not add this key, please remove it immediately from your account settings and change your password.

Visit: https://github.com/settings/keys

Thanks,
The GitHub Team`,
    safeActions: [
      "Este e-mail é legítimo e veio do domínio @github.com",
      "Se reconhece a ação, nenhuma medida é necessária",
      "Se não reconhece, acesse github.com diretamente e remova a chave",
    ],
  },
  {
    id: 3,
    from: "premio@loteria-federal-oficial.com.br",
    fromDisplay: "Loteria Federal",
    subject: "🎉 Parabéns! Você ganhou R$50.000 — resgate hoje!",
    preview: "Seu número foi sorteado. Para resgatar, informe seus dados bancários...",
    time: "07:48",
    isPhishing: true,
    redFlags: [
      "Você não se inscreveu em nenhum sorteio",
      "Pede dados bancários por e-mail",
      "Domínio suspeito não oficial do governo",
      "Oferta irreal para criar senso de urgência",
    ],
    body: `PARABÉNS!

Seu CPF foi selecionado em nosso sorteio e você ganhou R$ 50.000,00!

Para resgatar seu prêmio, envie seus dados bancários e uma taxa de processamento de R$ 59,90.

[ RESGATAR MEU PRÊMIO ]

Loteria Federal Oficial`,
    safeActions: [
      "NUNCA envie dinheiro para receber prêmios",
      "Loterias legítimas não pedem taxas antecipadas",
      "Delete e reporte como spam",
      "Se suspeitar de golpe, registre na Polícia Civil",
    ],
  },
  {
    id: 4,
    from: "suporte@mercadolivre-seguranca.com",
    fromDisplay: "Mercado Livre Segurança",
    subject: "🔒 Atividade incomum detectada na sua conta",
    preview: "Detectamos um acesso de um novo dispositivo. Confirme agora...",
    time: "10:21",
    isPhishing: true,
    redFlags: [
      "Domínio suspeito: '@mercadolivre-seguranca.com' não é o domínio oficial",
      "Pedido para confirmar dados pessoais",
      "Link de verificação externo",
      "Mensagem genérica sem seu nome",
    ],
    body: `Olá,

Detectamos um acesso à sua conta a partir de um novo dispositivo.

Por segurança, precisamos que você confirme seus dados imediatamente para evitar a suspensão da sua conta.

[ CONFIRMAR ACESSO AGORA ]

Caso não realize a verificação em até 12 horas, seu acesso poderá ser bloqueado.

Equipe de Segurança Mercado Livre`,
    safeActions: [
      "Não clicar em links recebidos por e-mail",
      "Acessar mercadolivre.com.br diretamente no navegador",
      "Verificar a atividade recente na conta",
      "Reportar o e-mail como phishing",
    ],
  },
  {
    id: 5,
    from: "no-reply@amazon.com",
    fromDisplay: "Amazon",
    subject: "Seu pedido foi enviado",
    preview: "Seu pacote foi despachado e está a caminho...",
    time: "07:58",
    isPhishing: false,
    redFlags: [],
    body: `Hello,

Your order has been shipped and is on the way.

Order number: #782-3341982-2219384

You can track your package using the link below:

https://www.amazon.com/your-orders

Thank you for shopping with us.

Amazon Customer Service`,
    safeActions: [
      "O domínio do e-mail é legítimo (@amazon.com)",
      "O link aponta para o domínio oficial da Amazon",
      "Você pode acessar sua conta diretamente pelo site oficial para conferir",
    ],
  },
  {
    id: 6,
    from: "faturamento@netflix-support.co",
    fromDisplay: "Netflix Billing",
    subject: "Problema com seu pagamento",
    preview: "Não conseguimos processar seu pagamento mensal...",
    time: "11:47",
    isPhishing: true,
    redFlags: [
      "Domínio falso: '@netflix-support.co'",
      "Pedido para atualizar dados de pagamento",
      "Tentativa de gerar urgência",
      "Link externo para página falsa de login",
    ],
    body: `Prezado cliente,

Não conseguimos processar seu pagamento mensal da Netflix.

Para evitar a suspensão da sua conta, atualize suas informações de pagamento imediatamente.

[ ATUALIZAR PAGAMENTO ]

Caso não realize a atualização nas próximas 24 horas, seu acesso será interrompido.

Netflix Billing Department`,
    safeActions: [
      "Não clicar no link do e-mail",
      "Acessar netflix.com diretamente",
      "Verificar suas informações de pagamento na conta oficial",
      "Reportar o e-mail como phishing",
    ],
  },
  {
    id: 7,
    from: "security@google.com",
    fromDisplay: "Google Security",
    subject: "Novo login na sua Conta Google",
    preview: "Detectamos um login a partir de um novo dispositivo...",
    time: "06:33",
    isPhishing: false,
    redFlags: [],
    body: `Hello,

We detected a new sign-in to your Google Account from a Windows device.

Location: São Paulo, Brazil
Time: Today, 06:30

If this was you, no action is required.

If you don't recognize this activity, please secure your account immediately.

https://myaccount.google.com/security

Google Security Team`,
    safeActions: [
      "E-mail enviado do domínio legítimo @google.com",
      "Link aponta para o domínio oficial do Google",
      "Se você não reconhece o login, acesse sua conta e revise a atividade",
    ],
  },
  {
    id: 8,
    from: "suporte@paypal-verification.net",
    fromDisplay: "PayPal Support",
    subject: "⚠️ Sua conta foi limitada temporariamente",
    preview: "Precisamos verificar suas informações para restaurar...",
    time: "12:04",
    isPhishing: true,
    redFlags: [
      "Domínio falso '@paypal-verification.net'",
      "Tentativa de assustar o usuário com limitação de conta",
      "Solicitação de confirmação de dados",
      "Link externo que pode levar a página falsa",
    ],
    body: `Dear customer,

Your PayPal account has been temporarily limited due to unusual activity.

To restore full access, please confirm your identity.

[ RESTORE ACCOUNT ACCESS ]

Failure to verify your account may result in permanent suspension.

PayPal Security Team`,
    safeActions: [
      "Não clicar em links recebidos por e-mail",
      "Acessar paypal.com diretamente",
      "Verificar notificações dentro da conta oficial",
      "Reportar o e-mail como phishing",
    ],
  }
];

type EmailStatus = Record<number, "phishing" | "safe" | null>;

export default function EmailSimulator() {
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<EmailStatus>({});
  const [showResult, setShowResult] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const selectedEmail = emails.find((e) => e.id === selected);

  const handleAnswer = async (emailId: number, answer: "phishing" | "safe") => {
    if (answers[emailId]) return;
    const email = emails.find((e) => e.id === emailId);
    if (!email) return;

    const action = answer === "phishing" ? "report" : "click";

    try {
      const response = await apiFetch("simulations/phishing/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          emailId: email.id.toString(),
          action,
        }),
      });
      const data = await response.json();

      const correct = (answer === "phishing") === email.isPhishing;
      setAnswers((prev) => ({ ...prev, [emailId]: answer }));
      setScore((prev) => (correct ? prev + 100 : Math.max(0, prev - 30)));
      setShowResult(emailId);
    } catch (error) {
      console.error("Error logging phishing action:", error);
      // Fallback for demo
      const correct = (answer === "phishing") === email.isPhishing;
      setAnswers((prev) => ({ ...prev, [emailId]: answer }));
      setScore((prev) => (correct ? prev + 100 : Math.max(0, prev - 30)));
      setShowResult(emailId);
    }
  };

  const getResultForEmail = (email: (typeof emails)[0]) => {
    const ans = answers[email.id];
    if (!ans) return null;
    const correct = (ans === "phishing") === email.isPhishing;
    return correct;
  };

  return (
    <AppLayout>
      <div className="animate-fade-in-up" style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <span style={{ fontSize: "24px" }}>📧</span>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)" }}>
            Simulador de E-mail
          </h1>
          {Object.keys(answers).length > 0 && (
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
              Score: +{score}
            </span>
          )}
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Analise cada e-mail e determine se é phishing ou legítimo.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", alignItems: "start" }}>
        {/* Email list */}
        <div
          className="card"
          style={{ overflow: "hidden" }}
        >
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Caixa de Entrada ({emails.length})
          </div>
          {emails.map((email) => {
            const result = getResultForEmail(email);
            return (
              <div
                key={email.id}
                onClick={() => setSelected(email.id)}
                style={{
                  padding: "14px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border-subtle)",
                  background: selected === email.id ? "rgba(0,212,255,0.06)" : "transparent",
                  borderLeft: selected === email.id ? "3px solid var(--accent-cyan)" : "3px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {email.fromDisplay}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{email.time}</span>
                    {result !== null && (
                      <span style={{ fontSize: "14px" }}>{result ? "✅" : "❌"}</span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {email.subject}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {email.preview}
                </div>
              </div>
            );
          })}
        </div>

        {/* Email body */}
        {selectedEmail ? (
          <div className="animate-fade-in-up card" style={{ overflow: "hidden" }}>
            {/* Email header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
                {selectedEmail.subject}
              </h2>
              <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", minWidth: "40px" }}>De:</span>
                  <span className="font-mono" style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {selectedEmail.from}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", minWidth: "40px" }}>Para:</span>
                  <span className="font-mono" style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    voce@email.com
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "14px",
                  lineHeight: "1.8",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  background: "var(--bg-secondary)",
                  borderRadius: "8px",
                  padding: "20px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {selectedEmail.body}
              </div>
            </div>

            {/* Action buttons */}
            {!answers[selectedEmail.id] ? (
              <div style={{ padding: "20px 24px", display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "14px", color: "var(--text-muted)", marginRight: "4px" }}>Este e-mail é:</span>
                <button
                  className="btn-cyber btn-danger"
                  onClick={() => handleAnswer(selectedEmail.id, "phishing")}
                >
                  🚨 Phishing!
                </button>
                <button
                  className="btn-cyber btn-success"
                  onClick={() => handleAnswer(selectedEmail.id, "safe")}
                >
                  ✅ Legítimo
                </button>
              </div>
            ) : (
              <div style={{ padding: "20px 24px" }}>
                {/* Result panel */}
                {showResult === selectedEmail.id && (
                  <div
                    className="animate-fade-in-up"
                    style={{
                      borderRadius: "10px",
                      padding: "20px",
                      background: selectedEmail.isPhishing
                        ? (answers[selectedEmail.id] === "phishing" ? "rgba(0,255,136,0.06)" : "rgba(255,68,68,0.06)")
                        : (answers[selectedEmail.id] === "safe" ? "rgba(0,255,136,0.06)" : "rgba(255,68,68,0.06)"),
                      border: `1px solid ${getResultForEmail(selectedEmail)
                          ? "rgba(0,255,136,0.2)"
                          : "rgba(255,68,68,0.2)"
                        }`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                      <span style={{ fontSize: "22px" }}>{getResultForEmail(selectedEmail) ? "🎉" : "💀"}</span>
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: "16px",
                          color: getResultForEmail(selectedEmail) ? "var(--accent-green)" : "var(--accent-red)",
                        }}
                      >
                        {getResultForEmail(selectedEmail) ? "Correto! +100 pontos" : "Errado! -30 pontos"}
                      </h3>
                    </div>

                    {selectedEmail.isPhishing && selectedEmail.redFlags.length > 0 && (
                      <div style={{ marginBottom: "14px" }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-red)", marginBottom: "8px" }}>
                          🚩 Sinais de Phishing identificados:
                        </p>
                        <ul style={{ paddingLeft: "16px" }}>
                          {selectedEmail.redFlags.map((flag, i) => (
                            <li key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", lineHeight: 1.5 }}>
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-cyan)", marginBottom: "8px" }}>
                        ✅ O que fazer:
                      </p>
                      <ul style={{ paddingLeft: "16px" }}>
                        {selectedEmail.safeActions.map((action, i) => (
                          <li key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", lineHeight: 1.5 }}>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              color: "var(--text-muted)",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "48px", opacity: 0.3 }}>📬</span>
            <p style={{ fontSize: "15px" }}>Selecione um e-mail para analisar</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
