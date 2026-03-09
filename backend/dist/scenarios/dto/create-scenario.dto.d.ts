import { ScenarioType, ScenarioDifficulty } from '../entities/scenario.entity';
export declare class CreateScenarioDto {
    title: string;
    description: string;
    type: ScenarioType;
    difficulty: ScenarioDifficulty;
    maxScore: number;
    xpReward: number;
    durationSeconds: number;
    config?: Record<string, any>;
    tags?: string[];
}
