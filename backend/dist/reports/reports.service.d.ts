import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Score } from '../scores/entities/score.entity';
import { AttackEvent } from '../events/entities/attack-event.entity';
export declare class ReportsService {
    private readonly userRepo;
    private readonly scoreRepo;
    private readonly attackRepo;
    constructor(userRepo: Repository<User>, scoreRepo: Repository<Score>, attackRepo: Repository<AttackEvent>);
    getGlobalSummary(): Promise<{
        totalUsers: number;
        totalSimulations: number;
        avgScore: number;
        criticalAttacksLastMonth: number;
    }>;
    getUserProgress(userId: string): Promise<{
        history: Score[];
        currentLevel: import("../users/entities/user.entity").UserLevel;
    }>;
}
