import { UserAction } from '../../events/entities/user-action.entity';
import { Score } from '../../scores/entities/score.entity';
export declare enum ScenarioDifficulty {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum ScenarioType {
    PHISHING_EMAIL = "phishing_email",
    FAKE_LOGIN = "fake_login",
    SOCIAL_ENGINEERING = "social_engineering",
    RANSOMWARE = "ransomware",
    BRUTE_FORCE = "brute_force",
    INSIDER_THREAT = "insider_threat",
    SQL_INJECTION = "sql_injection"
}
export declare class Scenario {
    id: string;
    title: string;
    description: string;
    type: ScenarioType;
    difficulty: ScenarioDifficulty;
    maxScore: number;
    xpReward: number;
    durationSeconds: number;
    config: Record<string, any>;
    tags: string[];
    isActive: boolean;
    timesPlayed: number;
    avgScore: number;
    actions: UserAction[];
    scores: Score[];
    createdAt: Date;
    updatedAt: Date;
}
