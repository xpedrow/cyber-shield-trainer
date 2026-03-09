import { ActionType, ActionRisk } from '../entities/user-action.entity';
export declare class CreateUserActionDto {
    scenarioId?: string;
    actionType: ActionType;
    risk?: ActionRisk;
    pointsDelta?: number;
    metadata?: Record<string, any>;
    responseTimeMs?: number;
    isCorrect?: boolean;
    sessionId?: string;
}
