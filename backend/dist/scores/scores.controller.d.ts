import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
export declare class ScoresController {
    private readonly scoresService;
    constructor(scoresService: ScoresService);
    submit(req: any, dto: CreateScoreDto): Promise<import("./entities/score.entity").Score>;
    findAllMyScores(req: any): Promise<import("./entities/score.entity").Score[]>;
    getMyStats(req: any): Promise<{
        scenariosCompleted: number;
        totalPoints: number;
        avgAccuracy: number;
        recentActivity: import("./entities/score.entity").Score[];
    }>;
    getBest(req: any, scenarioId: string): Promise<import("./entities/score.entity").Score>;
}
