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
exports.SimulationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const phishing_service_1 = require("./phishing.service");
const password_security_service_1 = require("./password-security.service");
const social_engineering_service_1 = require("./social-engineering.service");
const network_attack_service_1 = require("./network-attack.service");
const insider_threat_service_1 = require("./insider-threat.service");
const sql_injection_service_1 = require("./sql-injection.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
class SocialActionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SocialActionDto.prototype, "scenarioId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SocialActionDto.prototype, "optionId", void 0);
class NetworkActionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NetworkActionDto.prototype, "attackId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['block', 'monitor', 'ignore']),
    __metadata("design:type", String)
], NetworkActionDto.prototype, "action", void 0);
class PhishingActionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PhishingActionDto.prototype, "emailId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['click', 'report', 'ignore']),
    __metadata("design:type", String)
], PhishingActionDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PhishingActionDto.prototype, "metadata", void 0);
class TestPasswordDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestPasswordDto.prototype, "password", void 0);
class InsiderThreatActionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InsiderThreatActionDto.prototype, "threatId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['investigate', 'block-access', 'report', 'monitor']),
    __metadata("design:type", String)
], InsiderThreatActionDto.prototype, "action", void 0);
class SqlInjectionTestDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SqlInjectionTestDto.prototype, "scenarioId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SqlInjectionTestDto.prototype, "injection", void 0);
let SimulationsController = class SimulationsController {
    constructor(phishingService, passwordService, socialService, networkService, insiderThreatService, sqlInjectionService) {
        this.phishingService = phishingService;
        this.passwordService = passwordService;
        this.socialService = socialService;
        this.networkService = networkService;
        this.insiderThreatService = insiderThreatService;
        this.sqlInjectionService = sqlInjectionService;
    }
    getEmails() {
        return this.phishingService.getTemplates();
    }
    trackPhishing(req, dto) {
        return this.phishingService.trackAction(req.user.userId, dto.emailId, dto.action, dto.metadata);
    }
    testPassword(dto) {
        return this.passwordService.analyze(dto.password);
    }
    getSocialScenarios() {
        return this.socialService.getScenarios();
    }
    playSocial(req, dto) {
        return this.socialService.playScenario(req.user.userId, dto.scenarioId, dto.optionId);
    }
    getNetworkAttacks() {
        return this.networkService.getAttacks();
    }
    handleNetwork(req, dto) {
        return this.networkService.handleAttack(req.user.userId, dto.attackId, dto.action);
    }
    getInsiderThreats() {
        return this.insiderThreatService.getThreats();
    }
    handleInsiderThreat(req, dto) {
        return this.insiderThreatService.handleThreat(req.user.userId, dto.threatId, dto.action);
    }
    getSqlInjectionScenarios() {
        return this.sqlInjectionService.getScenarios();
    }
    testSqlInjection(req, dto) {
        return this.sqlInjectionService.testInjection(req.user.userId, dto.scenarioId, dto.injection);
    }
};
exports.SimulationsController = SimulationsController;
__decorate([
    (0, common_1.Get)('phishing/emails'),
    (0, swagger_1.ApiOperation)({ summary: 'List all phishing email templates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "getEmails", null);
__decorate([
    (0, common_1.Post)('phishing/action'),
    (0, swagger_1.ApiOperation)({ summary: 'Track user action in a phishing email' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PhishingActionDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "trackPhishing", null);
__decorate([
    (0, common_1.Post)('password/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze password strength and crack time' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestPasswordDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "testPassword", null);
__decorate([
    (0, common_1.Get)('social/scenarios'),
    (0, swagger_1.ApiOperation)({ summary: 'List social engineering scenarios' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "getSocialScenarios", null);
__decorate([
    (0, common_1.Post)('social/play'),
    (0, swagger_1.ApiOperation)({ summary: 'Play a social engineering scenario' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SocialActionDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "playSocial", null);
__decorate([
    (0, common_1.Get)('network/attacks'),
    (0, swagger_1.ApiOperation)({ summary: 'List network attack simulations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "getNetworkAttacks", null);
__decorate([
    (0, common_1.Post)('network/handle'),
    (0, swagger_1.ApiOperation)({ summary: 'Handle a network attack simulation' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, NetworkActionDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "handleNetwork", null);
__decorate([
    (0, common_1.Get)('insider-threat/threats'),
    (0, swagger_1.ApiOperation)({ summary: 'List insider threat scenarios' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "getInsiderThreats", null);
__decorate([
    (0, common_1.Post)('insider-threat/handle'),
    (0, swagger_1.ApiOperation)({ summary: 'Handle an insider threat scenario' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, InsiderThreatActionDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "handleInsiderThreat", null);
__decorate([
    (0, common_1.Get)('sql-injection/scenarios'),
    (0, swagger_1.ApiOperation)({ summary: 'List SQL injection scenarios' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "getSqlInjectionScenarios", null);
__decorate([
    (0, common_1.Post)('sql-injection/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test an SQL injection attempt' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SqlInjectionTestDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "testSqlInjection", null);
exports.SimulationsController = SimulationsController = __decorate([
    (0, swagger_1.ApiTags)('simulations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)({ path: 'simulations', version: '1' }),
    __metadata("design:paramtypes", [phishing_service_1.PhishingService,
        password_security_service_1.PasswordSecurityService,
        social_engineering_service_1.SocialEngineeringService,
        network_attack_service_1.NetworkAttackService,
        insider_threat_service_1.InsiderThreatService,
        sql_injection_service_1.SqlInjectionService])
], SimulationsController);
//# sourceMappingURL=simulations.controller.js.map