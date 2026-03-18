"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

import { 
  LayoutDashboard, 
  ShieldAlert, 
  Mail, 
  Lock, 
  Users, 
  Network, 
  KeyRound, 
  BarChart3,
  ShieldCheck
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/scenarios", label: "Cenários", icon: <ShieldAlert size={18} /> },
  { href: "/email-simulator", label: "Simulador de E-mail", icon: <Mail size={18} /> },
  { href: "/login-simulator", label: "Simulador de Login", icon: <Lock size={18} /> },
  { href: "/social-engineering", label: "Engenharia Social", icon: <Users size={18} /> },
  { href: "/network-attack", label: "Ataque de Rede", icon: <Network size={18} /> },
  { href: "/password-simulator", label: "Simulador de Senha", icon: <KeyRound size={18} /> },
  { href: "/feedback", label: "Feedback & Score", icon: <BarChart3 size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          if (pathname !== "/login") {
            router.push("/login");
          }
          return;
        }

        const res = await apiFetch("users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          if (pathname !== "/login") {
            router.push("/login");
          }
        }
      } catch (e) {
        console.error("Erro ao buscar dados do usuário:", e);
      }
    };
    fetchUser();
  }, [pathname, router]);

  return (
    <aside
      className="sidebar"
      style={{
        width: "220px",
        height: "100vh",
        background: "var(--black2)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "var(--mono)"
      }}
    >
      {/* ═══ LOGO ═══ */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            border: "1.5px solid var(--green)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--green)",
            fontFamily: "var(--display)",
            fontSize: "0.9rem"
          }}
        >
          ⬢
        </div>
        <div>
          <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "0.85rem", color: "var(--green)", letterSpacing: "0.12em" }}>
            CYBER<span>SHIELD</span>
          </div>
          <div style={{ fontSize: "0.55rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Trainer v2.0
          </div>
        </div>
      </div>

      {/* ═══ NAVIGATION ═══ */}
      <div style={{ padding: "14px 0", flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "0 16px 8px", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)" }}>
          Navegação Principal
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 16px",
                fontSize: "0.73rem",
                letterSpacing: "0.06em",
                color: isActive ? "var(--green)" : "var(--muted)",
                background: isActive ? "var(--gdim)" : "transparent",
                borderLeft: `2px solid ${isActive ? "var(--green)" : "transparent"}`,
                transition: "all 0.2s",
                textDecoration: "none",
                position: "relative"
              }}
              className={isActive ? "active" : ""}
            >
              <span style={{ fontSize: "0.85rem", width: "20px", textAlign: "center" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "1px", background: "linear-gradient(180deg, transparent, var(--green), transparent)" }} />
              )}
            </Link>
          );
        })}
      </div>

      {/* ═══ USER PROFILE ═══ */}
      <div
        style={{
          marginTop: "auto",
          padding: "14px 16px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "1.5px solid var(--green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              background: "var(--gdim)",
              fontFamily: "var(--display)",
              flexShrink: 0
            }}
          >
            {userData?.name ? userData.name[0].toUpperCase() : "A"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "0.73rem", color: "var(--white)", letterSpacing: "0.06em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {userData?.name || "Agente Trainee"}
            </div>
            <div style={{ fontSize: "0.62rem", color: "var(--muted)", marginTop: "2px" }}>
              Level: {userData?.level || "RECRUTA"}
            </div>
          </div>
        </div>
        {/* XP Bar */}
        <div style={{ marginTop: "8px", height: "3px", background: "var(--black4)", borderRadius: "2px", overflow: "hidden" }}>
          <div 
            style={{ 
              height: "100%", 
              width: "35%", 
              background: "var(--green)", 
              boxShadow: "0 0 8px var(--green)",
              animation: "fill-glow 2s ease-in-out infinite alternate" 
            }} 
          />
        </div>
      </div>
      <style jsx>{`
        span span { color: var(--cyan); }
        @keyframes fill-glow {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
      `}</style>
    </aside>
  );
}
