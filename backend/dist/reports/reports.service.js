"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const score_entity_1 = require("../scores/entities/score.entity");
const attack_event_entity_1 = require("../events/entities/attack-event.entity");
let ReportsService = class ReportsService {
    constructor(userRepo, scoreRepo, attackRepo) {
        this.userRepo = userRepo;
        this.scoreRepo = scoreRepo;
        this.attackRepo = attackRepo;
    }
    async getGlobalSummary() {
        const totalUsers = await this.userRepo.count();
        const totalSimulations = await this.scoreRepo.count();
        const avgScore = await this.scoreRepo.average('score');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const criticalAttacks = await this.attackRepo.count({
            where: {
                severity: attack_event_entity_1.EventSeverity.CRITICAL,
                createdAt: (0, typeorm_2.Between)(thirtyDaysAgo, new Date())
            }
        });
        return {
            totalUsers,
            totalSimulations,
            avgScore: Math.round(avgScore || 0),
            criticalAttacksLastMonth: criticalAttacks,
        };
    }
    async getUserProgress(userId) {
        const scores = await this.scoreRepo.find({
            where: { userId },
            order: { createdAt: 'ASC' },
            select: ['score', 'createdAt', 'accuracy'],
        });
        return {
            history: scores.slice(-20),
            currentLevel: (await this.userRepo.findOne({ where: { id: userId }, select: ['level'] }))?.level,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(score_entity_1.Score)),
    __param(2, (0, typeorm_1.InjectRepository)(attack_event_entity_1.AttackEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map