import { Repository } from 'typeorm';
import { UserAction } from './entities/user-action.entity';
import { AttackEvent } from './entities/attack-event.entity';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { CreateAttackEventDto } from './dto/create-attack-event.dto';
export declare class EventsService {
    private readonly actionRepo;
    private readonly attackRepo;
    constructor(actionRepo: Repository<UserAction>, attackRepo: Repository<AttackEvent>);
    logAction(userId: string, dto: CreateUserActionDto): Promise<UserAction>;
    logAttack(userId: string | null, dto: CreateAttackEventDto): Promise<AttackEvent>;
    getRecentActions(userId: string, limit?: number): Promise<UserAction[]>;
    getRecentAttacks(userId?: string, limit?: number): Promise<AttackEvent[]>;
    getSecurityLog(userId?: string, limit?: number): Promise<{
        id: string;
        timestamp: Date;
        type: string;
        severity: import("./entities/attack-event.entity").EventSeverity;
        title: string;
        description: string;
        detected: boolean;
    }[]>;
}
