import { EventsService } from '../events/events.service';
import { ActionRisk } from '../events/entities/user-action.entity';
export interface SocialEngineeringScenario {
    id: string;
    title: string;
    message: string;
    sender: string;
    channel: 'SMS' | 'WhatsApp' | 'Phone' | 'Chat';
    options: {
        id: string;
        text: string;
        isCorrect: boolean;
        impact: string;
        risk: ActionRisk;
    }[];
    analysis: string;
}
export declare class SocialEngineeringService {
    private readonly eventsService;
    private readonly scenarios;
    constructor(eventsService: EventsService);
    getScenarios(): Promise<SocialEngineeringScenario[]>;
    playScenario(userId: string, scenarioId: string, optionId: string): Promise<{
        success: boolean;
        impact: string;
        analysis: string;
        optionSelected: {
            id: string;
            text: string;
            isCorrect: boolean;
            impact: string;
            risk: ActionRisk;
        };
        scenario: SocialEngineeringScenario;
    }>;
}
