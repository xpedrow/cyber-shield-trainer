"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ShieldCheck, Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await apiFetch("auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        
        
        setMessage("Se o e-mail existir, você receberá um link de redefinição.");
        
        
        console.log("Token de recuperação (Simulação):", data.token);
        
        
        setTimeout(() => {
          if (data.token) {
            router.push(`/reset-password?token=${data.token}`);
          }
        }, 3000);
      } else {
        setError("Ocorreu um erro. Verifique o e-mail digitado.");
      }
    } catch (_err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--black)",
        fontFamily: "var(--mono)"
      }}
    >
      <div
        className="panel"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "48px 40px",
          textAlign: "center",
          background: "var(--black2)",
        }}
      >
        <div 
          style={{ 
            width: '64px', 
            height: '64px', 
            border: '2px solid var(--cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            background: 'rgba(0,212,255,0.05)',
            boxShadow: '0 0 20px rgba(0,212,255,0.2)'
          }}
        >
          <ShieldCheck size={32} color="var(--cyan)" />
        </div>
        
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "var(--cyan)",
            marginBottom: "12px",
            letterSpacing: "0.1em",
          }}
        >
          Recuperação
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.75rem",
            marginBottom: "32px",
            lineHeight: "1.5"
          }}
        >
          Informe seu e-mail cadastrado para receber as instruções de redefinição de acesso.
        </p>

        {message ? (
          <div className="animate-fade-in-up">
            <div
              style={{
                padding: "20px",
                background: "rgba(0,255,65,0.05)",
                border: "1px solid var(--green)",
                color: "var(--green)",
                fontSize: "0.8rem",
                marginBottom: "24px"
              }}
            >
              {message}
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.7rem", marginBottom: "20px" }}>
              Redirecionando para a página de nova senha...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px", position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--cyan)", zIndex: 10 }} />
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="cyber-input"
                style={{ borderColor: "rgba(0,212,255,0.2)" }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "12px",
                  background: "var(--reddim)",
                  border: "1px solid var(--red)",
                  color: "var(--red)",
                  fontSize: "0.75rem",
                  marginBottom: "20px"
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-cyber"
              style={{
                width: "100%",
                padding: "14px",
                justifyContent: "center",
                fontSize: "0.8rem",
                marginBottom: "24px",
                background: "var(--cyan)",
                color: "var(--black)",
                borderColor: "var(--cyan)",
                boxShadow: "0 0 15px rgba(0,212,255,0.3)"
              }}
            >
              <Send size={16} style={{ marginRight: "8px" }} />
              {loading ? "ENVIANDO..." : "SOLICITAR RESET"}
            </button>
          </form>
        )}

        <button
          onClick={() => router.push("/login")}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: "0.75rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            margin: "0 auto"
          }}
        >
          <ArrowLeft size={14} /> Voltar para o login
        </button>
      </div>
    </div>
  );
}
