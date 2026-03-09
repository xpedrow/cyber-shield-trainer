import { PhishingService } from './phishing.service';
import { PasswordSecurityService } from './password-security.service';
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
    constructor(phishingService: PhishingService, passwordService: PasswordSecurityService);
    getEmails(): Promise<import("./phishing.service").PhishingEmail[]>;
    trackPhishing(req: any, dto: PhishingActionDto): Promise<{
        success: boolean;
        analysis: string;
        redFlags: string[];
        email: import("./phishing.service").PhishingEmail;
    }>;
    testPassword(dto: TestPasswordDto): import("./password-security.service").PasswordAnalysis;
}
export {};
