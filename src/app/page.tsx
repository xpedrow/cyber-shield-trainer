"use client";

import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";


import { 
  Shield, 
  Zap, 
  Target, 
  CheckCircle,
  ShieldCheck,
  Mail,
  Lock,
  Users,
  Network,
  ArrowRight
} from "lucide-react";

const statsDefault = [
  { label: "Score de Segurança", value: "0", unit: "/1000", color: "var(--accent-cyan)", icon: <Shield size={20} />, key: 'totalScore' },
  { label: "XP Total", value: "0", unit: "", color: "var(--accent-green)", icon: <CheckCircle size={20} />, key: 'xp' },
  { label: "Sequência", value: "0", unit: " dias", color: "var(--accent-orange)", icon: <Zap size={20} />, key: 'streak' },
  { label: "Cenários", value: "0", unit: "", color: "var(--accent-purple)", icon: <Target size={20} />, key: 'scenarios' },
];

const scenarios = [
  {
    id: "phishing",
    title: "Ataque de Phishing",
    description: "Identifique e-mails fraudulentos tentando roubar suas credenciais.",
    difficulty: "Médio",
    difficultyClass: "threat-medium",
    icon: <Mail size={22} />,
    href: "/email-simulator",
    progress: 0,
  },
  {
    id: "fake-login",
    title: "Login Falso",
    description: "Detecte páginas de login falsas criadas para capturar senhas.",
    difficulty: "Alto",
    difficultyClass: "threat-high",
    icon: <Lock size={22} />,
    href: "/login-simulator",
    progress: 0,
  },
  {
    id: "social",
    title: "Engenharia Social",
    description: "Reconheça manipulações psicológicas usadas por atacantes.",
    difficulty: "Crítico",
    difficultyClass: "threat-critical",
    icon: <Users size={22} />,
    href: "/social-engineering",
    progress: 0,
  },
  {
    id: "network",
    title: "Ataque de Rede",
    description: "Analise logs e tome decisões contra invasões em tempo real.",
    difficulty: "Médio",
    difficultyClass: "threat-medium",
    icon: <Network size={22} />,
    href: "/network-attack",
    progress: 0,
  },
];

function ScoreRing({ score }: { score: number }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 1000) / 1000) * circumference;

  return (
    <div style={{ position: "relative", width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="150" height="150" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)", filter: "drop-shadow(var(--glow-cyan))" }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-cyan)" />
            <stop offset="100%" stopColor="var(--accent-blue)" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          userSelect: "none"
        }}
      >
        <span style={{ fontSize: "36px", fontWeight: 900, color: "var(--text-primary)", lineHeight: 0.9, letterSpacing: "-0.04em" }}>
          {score}
        </span>
        <span style={{ fontSize: "11px", color: "var(--accent-cyan)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>
          Score
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch user data
        const userRes = await apiFetch("users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userRes.ok) {
          const data = await userRes.json();
          setUserData(data);
        }

        // Fetch stats
        const statsRes = await apiFetch("scores/me/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setUserData((prev: Record<string, unknown> | null) => ({ ...prev, ...statsData }));
        }

        // Fetch progress data
        const progressRes = await apiFetch("reports/my-progress", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setActivities(progressData.history || []);
        }
      } catch (e) {
        console.log("Fetch error, using mock data for demo", e);
      }
    };
    fetchData();
  }, []);

  const currentStats = statsDefault.map(s => {
    if (!userData) return s;
    if (s.key === 'totalScore') return { ...s, value: userData.totalPoints?.toString() || "0" };
    if (s.key === 'xp') return { ...s, value: userData.xp?.toString() || "0" };
    if (s.key === 'streak') return { ...s, value: userData.streak?.toString() || "0" };
    if (s.key === 'scenarios') return { ...s, value: userData.scenariosCompleted?.toString() || "0" };
    return s;
  });

  return (
    <AppLayout>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <ShieldCheck size={28} color="var(--accent-cyan)" />
              <h1 style={{ fontSize: "32px", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>
                Nexus Dashboard
              </h1>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", fontWeight: 500 }}>
              Bem-vindo ao centro de operações{userData ? `, Agente ${userData.name}` : ', Trainee'}.
            </p>
          </div>
          <div
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 20px",
              borderRadius: "12px",
              background: "rgba(0, 255, 163, 0.05)",
              border: "1px solid rgba(0, 255, 163, 0.15)",
              boxShadow: "var(--glow-green)"
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-green)", display: "block", animation: "pulse-glow 2s infinite" }} />
            <span style={{ fontSize: "14px", color: "var(--accent-green)", fontWeight: 700, letterSpacing: "0.5px" }}>SISTEMA OPERACIONAL</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {currentStats.map((stat, i) => (
          <div
            key={stat.label}
            className="cyber-card animate-fade-in-up"
            style={{ padding: "24px", animationDelay: `${i * 0.1}s` }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ color: stat.color, background: `${stat.color}15`, padding: "8px", borderRadius: "10px", border: `1px solid ${stat.color}30` }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Realtime</span>
            </div>
            <div style={{ fontSize: "36px", fontWeight: 900, color: stat.color, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {stat.value}<span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-muted)", marginLeft: "4px" }}>{stat.unit}</span>
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px", fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>
        {/* Scenarios */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Cenários de Treinamento</h2>
            <Link href="/scenarios" style={{ fontSize: "14px", color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {scenarios.map((sc, i) => (
              <Link
                key={sc.id}
                href={sc.href}
                style={{ textDecoration: "none" }}
                className="animate-fade-in-up"
              >
                <div
                  className="cyber-card glass-hover"
                  style={{ padding: "20px", animationDelay: `${i * 0.1}s` }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div
                      className="glass"
                      style={{
                        width: "56px", height: "56px",
                        borderRadius: "14px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        color: "var(--accent-cyan)",
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      {sc.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>{sc.title}</h3>
                        <span
                          className={sc.difficultyClass}
                          style={{ fontSize: "10px", fontWeight: 800, padding: "2px 10px", borderRadius: "100px", border: "1px solid", flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}
                        >
                          {sc.difficulty}
                        </span>
                      </div>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "14px", lineHeight: 1.5 }}>{sc.description}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ flex: 1, height: "6px", background: "var(--bg-secondary)", borderRadius: "100px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                          <div style={{ width: `${sc.progress}%`, height: "100%", background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))", borderRadius: "100px", transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                        </div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, width: "35px" }}>{sc.progress}%</span>
                      </div>
                    </div>
                    <ArrowRight size={20} style={{ color: "var(--text-muted)", flexShrink: 0, opacity: 0.5 }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Score panel */}
          <div className="cyber-card" style={{ padding: "32px", textAlign: "center" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", marginBottom: "28px", textTransform: "uppercase", letterSpacing: "2px" }}>
              Nível do Agente
            </h3>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <ScoreRing score={userData?.totalScore || 0} />
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "6px 20px",
                borderRadius: "100px",
                background: "rgba(0, 229, 255, 0.1)",
                border: "1px solid rgba(0, 229, 255, 0.2)",
                fontSize: "14px",
                fontWeight: 800,
                color: "var(--accent-cyan)",
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                boxShadow: "var(--glow-cyan)"
              }}
            >
              {userData?.level?.toUpperCase() || "RECRUTA"}
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Complete cenários de nível Crítico para ganhar <b>XP Bônus</b>.
            </p>
          </div>

          {/* Tips panel */}
          <div className="cyber-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Target size={18} color="var(--accent-orange)" />
              <h3 style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px" }}>
                Missão Diária
              </h3>
            </div>
            <div style={{ background: 'rgba(255, 157, 0, 0.05)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255, 157, 0, 0.1)' }}>
              <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.6, fontWeight: 500 }}>
                 "Simule um ataque de rede e neutralize 3 ameaças antes que o tempo acabe."
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
                <span style={{ fontSize: "12px", color: "var(--accent-orange)", fontWeight: 700 }}>+500 XP</span>
                <Link href="/network-attack">
                  <button className="btn-cyber btn-primary" style={{ padding: "6px 20px", fontSize: "12px", width: "auto" }}>INICIAR</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
