import { EventsService } from '../events/events.service';
import { EventSeverity } from '../events/entities/attack-event.entity';
export interface SqlInjectionScenario {
    id: string;
    vulnerableQuery: string;
    description: string;
    hints: string[];
    correctInjection: string;
    explanation: string;
    severity: EventSeverity;
}
export declare class SqlInjectionService {
    private readonly eventsService;
    private readonly scenarios;
    getScenarios(): SqlInjectionScenario[];
    getScenarioById(id: string): SqlInjectionScenario;
    testInjection(userId: string, scenarioId: string, injection: string): any;
    private simulateInjection;
    private getSimulatedResult;
    constructor(eventsService: EventsService);
}
