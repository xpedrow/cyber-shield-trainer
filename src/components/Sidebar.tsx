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
  ChevronLeft,
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
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          // Só redireciona se não estiver na página de login
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
          // Token inválido ou expirado
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          if (pathname !== "/login") {
            router.push("/login");
          }
        } else {
          setIsAuthenticated(false);
          if (pathname !== "/login") {
            router.push("/login");
          }
        }
      } catch (e) {
        console.error("Erro ao buscar dados do usuário:", e);
        setIsAuthenticated(false);
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
    };
    fetchUser();
  }, [pathname, router]);

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "240px",
        minHeight: "100vh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minHeight: "72px",
        }}
      >
        <div
          className="animate-pulse-glow"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "var(--glow-cyan)"
          }}
        >
          <ShieldCheck size={22} color="white" />
        </div>
        {!collapsed && (
          <div style={{ transition: "opacity 0.2s", userSelect: "none" }}>
            <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              CyberShield
            </div>
            <div style={{ fontSize: "10px", color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
              Trainer v2.0
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginLeft: "auto",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "5px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          <ChevronLeft 
            size={16} 
            style={{ 
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)", 
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" 
            }} 
          />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", paddingLeft: "6px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {!collapsed && "Menu"}
        </div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? "active" : ""}`}
            style={{ marginBottom: "4px", justifyContent: collapsed ? "center" : "flex-start" }}
            title={collapsed ? item.label : undefined}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-purple), #0066ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "14px",
            color: "white",
            flexShrink: 0,
          }}
        >
          {userData?.name ? userData.name[0].toUpperCase() : "U"}
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {userData?.name || "Trainee User"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {userData?.level || "Nível Iniciante"}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
