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
    } catch (err) {
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
    } catch (err) {
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
        background: "var(--bg-primary)",
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.05), transparent 80%)",
        padding: "20px",
      }}
    >
      <div
        className="cyber-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "48px 40px",
          textAlign: "center",
          background: "rgba(16, 25, 40, 0.8)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div 
          style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: 'var(--glow-cyan)'
          }}
        >
          <ShieldCheck size={32} color="white" />
        </div>
        
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 900,
            color: "var(--text-primary)",
            marginBottom: "8px",
            letterSpacing: "-0.04em"
          }}
        >
          Nexus Shield
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "15px",
            marginBottom: "40px",
            fontWeight: 500
          }}
        >
          {isLogin ? "Identifique-se para acessar o sistema" : "Inicie sua jornada na cibersegurança"}
        </p>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--text-muted)" }} />
              <input
                type="text"
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="cyber-input"
                style={{ paddingLeft: "36px" }}
              />
            </div>
          )}

          <div style={{ marginBottom: "16px", position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--text-muted)" }} />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="cyber-input"
              style={{ paddingLeft: "36px" }}
            />
          </div>

          <div style={{ marginBottom: "20px", position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--text-muted)" }} />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="cyber-input"
              style={{ paddingLeft: "36px" }}
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: "24px", position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--text-muted)" }} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="cyber-input"
                style={{ paddingLeft: "36px" }}
              />
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "12px",
                background: "rgba(255, 51, 102, 0.1)",
                border: "1px solid rgba(255, 51, 102, 0.2)",
                borderRadius: "8px",
                color: "var(--accent-red)",
                fontSize: "14px",
                marginBottom: "20px",
                fontWeight: 600
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-cyber btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 800,
              marginBottom: "24px",
              letterSpacing: "0.5px"
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
            color: "var(--accent-cyan)",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            margin: "0 auto",
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