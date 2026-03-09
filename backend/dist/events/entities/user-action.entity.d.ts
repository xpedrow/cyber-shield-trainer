import { User } from '../../users/entities/user.entity';
import { Scenario } from '../../scenarios/entities/scenario.entity';
export declare enum ActionType {
    EMAIL_OPENED = "email_opened",
    LINK_CLICKED = "link_clicked",
    ATTACHMENT_OPENED = "attachment_opened",
    EMAIL_REPORTED = "email_reported",
    EMAIL_DELETED = "email_deleted",
    PHISHING_IDENTIFIED = "phishing_identified",
    LOGIN_ATTEMPTED = "login_attempted",
    FAKE_SITE_IDENTIFIED = "fake_site_identified",
    CREDENTIALS_ENTERED = "credentials_entered",
    SITE_REPORTED = "site_reported",
    SCENARIO_STARTED = "scenario_started",
    SCENARIO_COMPLETED = "scenario_completed",
    SCENARIO_ABANDONED = "scenario_abandoned",
    HINT_REQUESTED = "hint_requested"
}
export declare enum ActionRisk {
    SAFE = "safe",
    WARNING = "warning",
    DANGEROUS = "dangerous"
}
export declare class UserAction {
    id: string;
    userId: string;
    user: User;
    scenarioId: string;
    scenario: Scenario;
    actionType: ActionType;
    risk: ActionRisk;
    pointsDelta: number;
    metadata: Record<string, any>;
    responseTimeMs: number;
    isCorrect: boolean;
    sessionId: string;
    createdAt: Date;
}
