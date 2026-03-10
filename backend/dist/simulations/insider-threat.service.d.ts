import { EventsService } from '../events/events.service';
import { EventSeverity } from '../events/entities/attack-event.entity';
export interface InsiderThreat {
    id: string;
    type: 'data-leak' | 'unauthorized-access' | 'policy-violation';
    description: string;
    evidence: string[];
    severity: EventSeverity;
    correctAction: 'investigate' | 'block-access' | 'report' | 'monitor';
    explanation: string;
}
export declare class InsiderThreatService {
    private readonly eventsService;
    private readonly threats;
    getThreats(): InsiderThreat[];
    getThreatById(id: string): InsiderThreat;
    handleThreat(userId: string, threatId: string, action: 'investigate' | 'block-access' | 'report' | 'monitor'): any;
    constructor(eventsService: EventsService);
}
