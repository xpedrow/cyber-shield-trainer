import { Score } from '../../scores/entities/score.entity';
import { UserAction } from '../../events/entities/user-action.entity';
export declare enum UserRole {
    TRAINEE = "trainee",
    ANALYST = "analyst",
    ADMIN = "admin"
}
export declare enum UserLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    level: UserLevel;
    totalScore: number;
    xp: number;
    streak: number;
    avatarUrl: string;
    isActive: boolean;
    lastLoginAt: Date;
    scores: Score[];
    actions: UserAction[];
    createdAt: Date;
    updatedAt: Date;
}
