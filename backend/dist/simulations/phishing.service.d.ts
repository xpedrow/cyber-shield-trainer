import { EventsService } from '../events/events.service';
export interface PhishingEmail {
    id: string;
    subject: string;
    sender: string;
    content: string;
    redFlags: string[];
    explanation: string;
    targetUrl: string;
    isPhishing: boolean;
}
export declare class PhishingService {
    private readonly eventsService;
    private readonly templates;
    constructor(eventsService: EventsService);
    getTemplates(): Promise<PhishingEmail[]>;
    getTemplate(id: string): Promise<PhishingEmail>;
    trackAction(userId: string, emailId: string, action: 'click' | 'report' | 'ignore', metadata: any): Promise<{
        success: boolean;
        analysis: string;
        redFlags: string[];
        email: PhishingEmail;
    }>;
}
