import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { CreateScoreDto } from './dto/create-score.dto';
import { ScenariosService } from '../scenarios/scenarios.service';
import { UsersService } from '../users/users.service';
export declare class ScoresService {
    private readonly scoreRepo;
    private readonly scenariosService;
    private readonly usersService;
    constructor(scoreRepo: Repository<Score>, scenariosService: ScenariosService, usersService: UsersService);
    submitScore(userId: string, dto: CreateScoreDto): Promise<Score>;
    findByUser(userId: string): Promise<Score[]>;
    getBestByScenario(userId: string, scenarioId: string): Promise<Score | null>;
    getGlobalStats(userId: string): Promise<{
        scenariosCompleted: number;
        totalPoints: number;
        avgAccuracy: number;
        recentActivity: Score[];
    }>;
}
