import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSummary(): Promise<{
        totalUsers: number;
        totalSimulations: number;
        avgScore: number;
        criticalAttacksLastMonth: number;
    }>;
    getMyProgress(req: any): Promise<{
        history: import("../scores/entities/score.entity").Score[];
        currentLevel: import("../users/entities/user.entity").UserLevel;
    }>;
}
