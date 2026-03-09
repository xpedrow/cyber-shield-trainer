import { PhishingService } from './phishing.service';
import { PasswordSecurityService } from './password-security.service';
import { SocialEngineeringService } from './social-engineering.service';
import { NetworkAttackService } from './network-attack.service';
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
export declare class SimulationsController {
    private readonly phishingService;
    private readonly passwordService;
    private readonly socialService;
    private readonly networkService;
    constructor(phishingService: PhishingService, passwordService: PasswordSecurityService, socialService: SocialEngineeringService, networkService: NetworkAttackService);
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
}
export {};
