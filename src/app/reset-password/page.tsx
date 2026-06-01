"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ShieldCheck, Key, ArrowLeft, CheckCircle } from "@phosphor-icons/react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token ausente. Solicite a redefinição novamente.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao redefinir senha. O token pode estar expirado.");
      }
    } catch (_err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "var(--red)", marginBottom: "20px" }}>Link de redefinição inválido.</p>
        <button className="btn-cyber" onClick={() => router.push("/forgot-password")}>
          Solicitar novo link
        </button>
      </div>
    );
  }

  return (
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
          border: '2px solid var(--green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          background: 'var(--gdim)',
          boxShadow: 'var(--glow-green)'
        }}
      >
        <ShieldCheck size={32} color="var(--green)" />
      </div>
      
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 900,
          color: "var(--green)",
          marginBottom: "12px",
          letterSpacing: "0.1em",
        }}
      >
        Nova Senha
      </h1>

      {success ? (
        <div className="animate-fade-in-up">
          <div style={{ color: "var(--green)", marginBottom: "20px" }}>
            <CheckCircle size={48} style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "1rem", fontWeight: 700 }}>Senha alterada com sucesso!</p>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
            Redirecionando para o login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "32px" }}>
            Crie uma nova senha de acesso para sua conta.
          </p>

          <div style={{ marginBottom: "16px", position: "relative" }}>
            <Key size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--green)", zIndex: 10 }} />
            <input
              type="password"
              placeholder="Nova Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="cyber-input"
            />
          </div>

          <div style={{ marginBottom: "24px", position: "relative" }}>
            <Key size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--green)", zIndex: 10 }} />
            <input
              type="password"
              placeholder="Confirmar Nova Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="cyber-input"
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
            }}
          >
            {loading ? "ATUALIZANDO..." : "REDEFINIR SENHA"}
          </button>

          <button
            type="button"
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
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <Suspense fallback={<div style={{ color: "var(--green)" }}>Carregando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
