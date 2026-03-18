"use client";

import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Users, 
  Network, 
  ArrowRight,
  Target
} from "lucide-react";

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await apiFetch("users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userRes.ok) {
          const data = await userRes.json();
          setUserData(data);
        }

        const statsRes = await apiFetch("scores/me/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setUserData((prev: any) => ({ ...prev, ...statsData }));
        }

        const progressRes = await apiFetch("reports/my-progress", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setActivities(progressData.history || []);
        }
      } catch (e) {
        console.log("Fetch error", e);
      }
    };
    fetchData();
  }, []);

  const scenarios = [
    {
      id: "phishing",
      title: "Ataque de Phishing",
      description: "Identifique e-mails fraudulentos tentando roubar suas credenciais.",
      difficulty: "Médio",
      icon: <Mail size={22} />,
      href: "/email-simulator",
      progress: 45,
      xp: "+250 XP"
    },
    {
      id: "fake-login",
      title: "Login Falso",
      description: "Detecte páginas de login falsas criadas para capturar senhas.",
      difficulty: "Alto",
      icon: <Lock size={22} />,
      href: "/login-simulator",
      progress: 0,
      xp: "+400 XP"
    },
    {
      id: "network",
      title: "Ataque de Rede",
      description: "Analise logs e tome decisões contra invasões em tempo real.",
      difficulty: "Crítico",
      icon: <Network size={22} />,
      href: "/network-attack",
      progress: 10,
      xp: "+600 XP"
    }
  ];

  return (
    <AppLayout>
      {/* ═══ DASHBOARD HERO ═══ */}
      <section 
        className="dashboard-hero"
        style={{
          background: "var(--black2)",
          border: "1px solid var(--border)",
          padding: "20px 24px",
          marginBottom: "20px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--green), var(--cyan), var(--green))", animation: "scan 3s linear infinite" }} />
        
        <div>
          <h1 style={{ fontFamily: "var(--display)", fontSize: "1.6rem", fontWeight: 900, letterSpacing: "0.08em", color: "var(--green)", textShadow: "0 0 30px rgba(0,255,65,0.5)" }}>
            BEM-VINDO, AGENTE
          </h1>
          <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "6px", letterSpacing: "0.08em" }}>
            CONEXÃO ESTABELECIDA // TERMINAL SEGURO // NÍVEL DE AMBIENTE: OPERACIONAL
          </p>
          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <div style={{ padding: "4px 10px", border: "1px solid var(--border)", fontSize: "0.6rem", color: "var(--green)" }}>IP: 192.168.1.104</div>
            <div style={{ padding: "4px 10px", border: "1px solid var(--border)", fontSize: "0.6rem", color: "var(--cyan)" }}>ESTADO: ATIVO</div>
          </div>
        </div>

        {/* RADAR SVG Animation */}
        <div style={{ position: "relative", width: "120px", height: "120px" }}>
          <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%" }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border)" strokeWidth="1" />
            <circle cx="80" cy="80" r="45" fill="none" stroke="var(--border)" strokeWidth="1" />
            <circle cx="80" cy="80" r="20" fill="none" stroke="var(--border)" strokeWidth="1" />
            <line x1="10" y1="80" x2="150" y2="80" stroke="var(--border)" strokeWidth="1" />
            <line x1="80" y1="10" x2="80" y2="150" stroke="var(--border)" strokeWidth="1" />
            <circle cx="50" cy="40" r="3" fill="var(--green)" className="animate-pulse" />
            <circle cx="110" cy="100" r="3" fill="var(--red)" className="animate-pulse" />
            <g className="radar-sweep">
               <path d="M 80,80 L 80,10 A 70,70 0 0 1 140.6,45 Z" fill="rgba(0,255,65,0.15)" />
            </g>
          </svg>
        </div>
      </section>

      {/* ═══ STATS GRID ═══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "AMEAÇAS NEUTRALIZADAS", value: userData?.scenariosCompleted || "14", color: "var(--green)" },
          { label: "PONTOS DE AGENTE", value: userData?.totalPoints || "742", color: "var(--cyan)" },
          { label: "XP ACUMULADO", value: userData?.xp || "12.4k", color: "var(--amber)" },
          { label: "VULNERABILIDADES", value: "03", color: "var(--red)" }
        ].map((stat, i) => (
          <div 
            key={i}
            className="panel"
            style={{ padding: "18px 16px", background: "var(--black2)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>{stat.label}</div>
            <div style={{ fontFamily: "var(--display)", fontSize: "1.8rem", fontWeight: 900, color: stat.color, textShadow: `0 0 16px ${stat.color}80` }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
        {/* Scenarios List */}
        <div className="panel" style={{ background: "var(--black2)", border: "1px solid var(--border)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--display)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", color: "var(--green)" }}>TREINAMENTOS DISPONÍVEIS</span>
            <Link href="/scenarios" style={{ fontSize: "0.6rem", color: "var(--muted)", textDecoration: "underline" }}>VER TODOS DA LISTA</Link>
          </div>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {scenarios.map((sc) => (
              <Link key={sc.id} href={sc.href} style={{ textDecoration: "none" }}>
                <div 
                  className="scenario-card"
                  style={{
                    background: "var(--black2)",
                    border: "1px solid var(--border)",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ width: "40px", height: "40px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", background: "var(--black)" }}>
                    {sc.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--white)", fontWeight: 700, fontFamily: "var(--display)" }}>{sc.title}</span>
                      <span style={{ fontSize: "0.6rem", color: "var(--amber)" }}>{sc.xp}</span>
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginBottom: "8px" }}>{sc.description}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                       <div style={{ flex: 1, height: "3px", background: "var(--black4)" }}>
                          <div style={{ width: `${sc.progress}%`, height: "100%", background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
                       </div>
                       <span style={{ fontSize: "0.6rem", color: "var(--muted)" }}>{sc.progress}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Mission */}
          <div className="panel" style={{ background: "var(--black2)", border: "1px solid rgba(0,207,207,0.3)", padding: "18px", position: "relative" }}>
             <div style={{ position: "absolute", top: "-1px", left: "16px", fontSize: "0.55rem", letterSpacing: "0.18em", color: "var(--cyan)", background: "var(--black2)", padding: "0 6px" }}>// MISSÃO DIÁRIA</div>
             <p style={{ fontSize: "0.8rem", color: "var(--white)", lineHeight: "1.6", marginBottom: "14px", fontStyle: "italic" }}>
               "Analise logs do firewall e localize a origem do ataque DDoS iniciado às 02:40 AM."
             </p>
             <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                <span style={{ padding: "4px 10px", border: "1px solid var(--amber)", background: "var(--ambdim)", color: "var(--amber)", fontSize: "0.62rem" }}>+500 XP</span>
                <span style={{ padding: "4px 10px", border: "1px solid var(--cyan)", background: "var(--cyandim)", color: "var(--cyan)", fontSize: "0.62rem" }}>+10 PONTOS</span>
             </div>
             <button style={{ width: "100%", padding: "8px", background: "transparent", border: "1px solid var(--cyan)", color: "var(--cyan)", fontFamily: "var(--mono)", fontSize: "0.7rem", cursor: "pointer" }}>INICIAR MISSÃO</button>
          </div>

          {/* Level Tracker */}
          <div className="panel" style={{ background: "var(--black2)", border: "1px solid var(--border)", padding: "18px" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--muted)", marginBottom: "12px" }}>PATENTE ATUAL</div>
            <div style={{ fontFamily: "var(--display)", fontSize: "1.4rem", fontWeight: 900, color: "var(--green)", letterSpacing: "0.12em", textShadow: "0 0 20px rgba(0,255,65,0.4)" }}>
              {userData?.level?.toUpperCase() || "AGENTE RECRUTA"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "4px" }}>SCORE: {userData?.totalPoints || "742"} / 1000</div>
            <div style={{ marginTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "var(--muted)", marginBottom: "6px" }}>
                <span>PRÓXIMO NÍVEL</span>
                <span>74%</span>
              </div>
              <div style={{ height: "4px", background: "var(--black4)" }}>
                <div style={{ width: "74%", height: "100%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        .radar-sweep {
          transform-origin: 80px 80px;
          animation: radar-spin 3s linear infinite;
        }
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .scenario-card:hover {
          border-color: var(--green) !important;
          background: var(--gdim) !important;
        }
      `}</style>
    </AppLayout>
  );
}
