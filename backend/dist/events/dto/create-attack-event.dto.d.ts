import { AttackEventType, EventSeverity } from '../entities/attack-event.entity';
export declare class CreateAttackEventDto {
    eventType: AttackEventType;
    severity: EventSeverity;
    title: string;
    description?: string;
    sourceIp?: string;
    wasDetected?: boolean;
    detectionTimeMs?: number;
    payload?: Record<string, any>;
    sessionId?: string;
}
