import { User } from '../../users/entities/user.entity';
export declare enum EventSeverity {
    INFO = "info",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum AttackEventType {
    PHISHING_ATTEMPT = "phishing_attempt",
    CREDENTIAL_THEFT = "credential_theft",
    MALWARE_SIMULATED = "malware_simulated",
    SOCIAL_ENGINEERING = "social_engineering",
    BRUTE_FORCE = "brute_force",
    RANSOMWARE_SIMULATED = "ransomware_simulated",
    SQL_INJECTION = "sql_injection",
    DOS_ATTACK = "dos_attack",
    PORT_SCAN = "port_scan",
    INSIDER_THREAT = "insider_threat"
}
export declare class AttackEvent {
    id: string;
    userId: string;
    user: User;
    eventType: AttackEventType;
    severity: EventSeverity;
    title: string;
    description: string;
    sourceIp: string;
    wasDetected: boolean;
    detectionTimeMs: number;
    payload: Record<string, any>;
    sessionId: string;
    isResolved: boolean;
    createdAt: Date;
}
