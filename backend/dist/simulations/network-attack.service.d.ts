import { EventsService } from '../events/events.service';
import { EventSeverity } from '../events/entities/attack-event.entity';
export interface NetworkAttack {
    id: string;
    type: 'port-scanning' | 'brute-force' | 'ddos-flood';
    ip: string;
    logs: string[];
    description: string;
    severity: EventSeverity;
    correctAction: 'block' | 'monitor' | 'ignore';
}
export declare class NetworkAttackService {
    private readonly eventsService;
    private readonly attacks;
    constructor(eventsService: EventsService);
    getAttacks(): Promise<NetworkAttack[]>;
    handleAttack(userId: string, attackId: string, action: 'block' | 'monitor' | 'ignore'): Promise<{
        success: boolean;
        analysis: string;
        attack: NetworkAttack;
    }>;
    private mapAttackType;
    private getAnalysis;
    private getActionJustification;
}
