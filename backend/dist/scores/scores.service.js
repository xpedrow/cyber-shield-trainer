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
exports.ScoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const score_entity_1 = require("./entities/score.entity");
const scenarios_service_1 = require("../scenarios/scenarios.service");
const users_service_1 = require("../users/users.service");
let ScoresService = class ScoresService {
    constructor(scoreRepo, scenariosService, usersService) {
        this.scoreRepo = scoreRepo;
        this.scenariosService = scenariosService;
        this.usersService = usersService;
    }
    async submitScore(userId, dto) {
        const scenario = await this.scenariosService.findOne(dto.scenarioId);
        if (dto.score > scenario.maxScore) {
            throw new common_1.BadRequestException('Score cannot exceed max score for this scenario');
        }
        const existingBest = await this.scoreRepo.findOne({
            where: { userId, scenarioId: dto.scenarioId, isBest: true },
        });
        const attemptNumber = (await this.scoreRepo.count({ where: { userId, scenarioId: dto.scenarioId } })) + 1;
        const isBest = !existingBest || dto.score > existingBest.score;
        if (isBest && existingBest) {
            existingBest.isBest = false;
            await this.scoreRepo.save(existingBest);
        }
        const accuracy = (dto.score / scenario.maxScore) * 100;
        const xpEarned = Math.floor(scenario.xpReward * (accuracy / 100));
        const score = this.scoreRepo.create({
            ...dto,
            userId,
            maxScore: scenario.maxScore,
            accuracy,
            xpEarned,
            isBest,
            attemptNumber,
        });
        const savedScore = await this.scoreRepo.save(score);
        await this.usersService.addXp(userId, xpEarned);
        await this.scenariosService.incrementPlayCount(dto.scenarioId);
        return savedScore;
    }
    async findByUser(userId) {
        return this.scoreRepo.find({
            where: { userId },
            relations: ['scenario'],
            order: { createdAt: 'DESC' },
        });
    }
    async getBestByScenario(userId, scenarioId) {
        return this.scoreRepo.findOne({
            where: { userId, scenarioId, isBest: true },
        });
    }
    async getGlobalStats(userId) {
        const scores = await this.findByUser(userId);
        const totalPoints = scores.reduce((acc, s) => acc + s.score, 0);
        const avgAccuracy = scores.length > 0 ? scores.reduce((acc, s) => acc + s.accuracy, 0) / scores.length : 0;
        return {
            scenariosCompleted: scores.length,
            totalPoints,
            avgAccuracy: Math.round(avgAccuracy),
            recentActivity: scores.slice(0, 5),
        };
    }
};
exports.ScoresService = ScoresService;
exports.ScoresService = ScoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(score_entity_1.Score)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        scenarios_service_1.ScenariosService,
        users_service_1.UsersService])
], ScoresService);
//# sourceMappingURL=scores.service.js.map