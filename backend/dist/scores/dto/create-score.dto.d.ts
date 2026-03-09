export declare class CreateScoreDto {
    scenarioId: string;
    score: number;
    hintsUsed?: number;
    completionTimeSeconds?: number;
    breakdown?: {
        phishingDetection?: number;
        responseTime?: number;
        correctActions?: number;
        bonusPoints?: number;
    };
}
