"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ShieldCheck, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Credenciais inválidas");
      }
    } catch (_err) {
      setError("Erro de conexão. Verifique se o servidor está ativo.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch("auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        const loginResponse = await apiFetch("auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem("token", loginData.accessToken);
          localStorage.setItem("refreshToken", loginData.refreshToken);
          router.push("/");
        } else {
          setError("Conta criada! Faça login para continuar.");
          setIsLogin(true);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao criar conta");
      }
    } catch (_err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--black)",
        position: "relative",
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
            fontSize: "1.8rem",
            fontWeight: 900,
            color: "var(--green)",
            marginBottom: "8px",
            letterSpacing: "0.1em",
            fontFamily: "var(--display)",
            textShadow: "0 0 20px rgba(0,255,65,0.4)"
          }}
        >
          Cyber Shield
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.75rem",
            marginBottom: "40px",
            letterSpacing: "0.05em"
          }}
        >
          {isLogin ? "Identifique-se para acessar o sistema" : "Inicie sua jornada na cibersegurança"}
        </p>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--green)", zIndex: 10 }} />
              <input
                type="text"
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="cyber-input"
              />
            </div>
          )}

          <div style={{ marginBottom: "16px", position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--green)", zIndex: 10 }} />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="cyber-input"
            />
          </div>

          <div style={{ marginBottom: "20px", position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--green)", zIndex: 10 }} />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="cyber-input"
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: "24px", position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--green)", zIndex: 10 }} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="cyber-input"
              />
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "12px",
                background: "var(--reddim)",
                border: "1px solid var(--red)",
                color: "var(--red)",
                fontSize: "0.75rem",
                marginBottom: "20px",
                fontFamily: "var(--mono)"
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
            {loading ? "PROCESSANDO..." : (isLogin ? "ENTRAR NO SISTEMA" : "CRIAR ACESSO")}
          </button>
        </form>

        <button
          onClick={toggleMode}
          style={{
            background: "none",
            border: "none",
            color: "var(--cyan)",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            margin: "0 auto",
            fontFamily: "var(--mono)"
          }}
        >
          {isLogin ? (
            <>Novo por aqui? Criar conta <ArrowRight size={14} /></>
          ) : (
            <>Já possui acesso? Fazer login <ArrowRight size={14} /></>
          )}
        </button>
      </div>
    </div>
  );
}