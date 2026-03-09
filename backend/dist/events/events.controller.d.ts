import { EventsService } from './events.service';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { CreateAttackEventDto } from './dto/create-attack-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    logAction(req: any, dto: CreateUserActionDto): Promise<import("./entities/user-action.entity").UserAction>;
    logAttack(req: any, dto: CreateAttackEventDto): Promise<import("./entities/attack-event.entity").AttackEvent>;
    getMyActions(req: any, limit: number): Promise<import("./entities/user-action.entity").UserAction[]>;
    getLog(limit: number, userId?: string): Promise<{
        id: string;
        timestamp: Date;
        type: string;
        severity: import("./entities/attack-event.entity").EventSeverity;
        title: string;
        description: string;
        detected: boolean;
    }[]>;
}
