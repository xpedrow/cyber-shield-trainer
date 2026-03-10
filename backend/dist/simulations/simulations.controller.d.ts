import { PhishingService } from './phishing.service';
import { PasswordSecurityService } from './password-security.service';
import { SocialEngineeringService } from './social-engineering.service';
import { NetworkAttackService } from './network-attack.service';
import { InsiderThreatService } from './insider-threat.service';
import { SqlInjectionService } from './sql-injection.service';
declare class SocialActionDto {
    scenarioId: string;
    optionId: string;
}
declare class NetworkActionDto {
    attackId: string;
    action: 'block' | 'monitor' | 'ignore';
}
declare class PhishingActionDto {
    emailId: string;
    action: 'click' | 'report' | 'ignore';
    metadata?: any;
}
declare class TestPasswordDto {
    password: string;
}
declare class InsiderThreatActionDto {
    threatId: string;
    action: 'investigate' | 'block-access' | 'report' | 'monitor';
}
declare class SqlInjectionTestDto {
    scenarioId: string;
    injection: string;
}
export declare class SimulationsController {
    private readonly phishingService;
    private readonly passwordService;
    private readonly socialService;
    private readonly networkService;
    private readonly insiderThreatService;
    private readonly sqlInjectionService;
    constructor(phishingService: PhishingService, passwordService: PasswordSecurityService, socialService: SocialEngineeringService, networkService: NetworkAttackService, insiderThreatService: InsiderThreatService, sqlInjectionService: SqlInjectionService);
    getEmails(): Promise<import("./phishing.service").PhishingEmail[]>;
    trackPhishing(req: any, dto: PhishingActionDto): Promise<{
        success: boolean;
        analysis: string;
        redFlags: string[];
        email: import("./phishing.service").PhishingEmail;
    }>;
    testPassword(dto: TestPasswordDto): import("./password-security.service").PasswordAnalysis;
    getSocialScenarios(): Promise<import("./social-engineering.service").SocialEngineeringScenario[]>;
    playSocial(req: any, dto: SocialActionDto): Promise<{
        success: boolean;
        impact: string;
        analysis: string;
        optionSelected: {
            id: string;
            text: string;
            isCorrect: boolean;
            impact: string;
            risk: import("../events/entities/user-action.entity").ActionRisk;
        };
        scenario: import("./social-engineering.service").SocialEngineeringScenario;
    }>;
    getNetworkAttacks(): Promise<import("./network-attack.service").NetworkAttack[]>;
    handleNetwork(req: any, dto: NetworkActionDto): Promise<{
        success: boolean;
        analysis: string;
        attack: import("./network-attack.service").NetworkAttack;
    }>;
    getInsiderThreats(): import("./insider-threat.service").InsiderThreat[];
    handleInsiderThreat(req: any, dto: InsiderThreatActionDto): any;
    getSqlInjectionScenarios(): import("./sql-injection.service").SqlInjectionScenario[];
    testSqlInjection(req: any, dto: SqlInjectionTestDto): any;
}
export {};
