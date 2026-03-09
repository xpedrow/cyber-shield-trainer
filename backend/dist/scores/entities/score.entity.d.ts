import { User } from '../../users/entities/user.entity';
import { Scenario } from '../../scenarios/entities/scenario.entity';
export declare class Score {
    id: string;
    userId: string;
    user: User;
    scenarioId: string;
    scenario: Scenario;
    score: number;
    maxScore: number;
    accuracy: number;
    xpEarned: number;
    hintsUsed: number;
    completionTimeSeconds: number;
    breakdown: {
        phishingDetection?: number;
        responseTime?: number;
        correctActions?: number;
        bonusPoints?: number;
    };
    isBest: boolean;
    attemptNumber: number;
    createdAt: Date;
}
