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
exports.ScoresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scores_service_1 = require("./scores.service");
const create_score_dto_1 = require("./dto/create-score.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ScoresController = class ScoresController {
    constructor(scoresService) {
        this.scoresService = scoresService;
    }
    submit(req, dto) {
        return this.scoresService.submitScore(req.user.userId, dto);
    }
    findAllMyScores(req) {
        return this.scoresService.findByUser(req.user.userId);
    }
    getMyStats(req) {
        return this.scoresService.getGlobalStats(req.user.userId);
    }
    getBest(req, scenarioId) {
        return this.scoresService.getBestByScenario(req.user.userId, scenarioId);
    }
};
exports.ScoresController = ScoresController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a new score for a scenario' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_score_dto_1.CreateScoreDto]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all my scores' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "findAllMyScores", null);
__decorate([
    (0, common_1.Get)('me/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my global performance stats' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)('best/:scenarioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my best score for a specific scenario' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('scenarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "getBest", null);
exports.ScoresController = ScoresController = __decorate([
    (0, swagger_1.ApiTags)('scores'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)({ path: 'scores', version: '1' }),
    __metadata("design:paramtypes", [scores_service_1.ScoresService])
], ScoresController);
//# sourceMappingURL=scores.controller.js.map