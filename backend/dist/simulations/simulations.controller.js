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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
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
let SimulationsController = class SimulationsController {
    constructor(phishingService, passwordService) {
        this.phishingService = phishingService;
        this.passwordService = passwordService;
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
exports.SimulationsController = SimulationsController = __decorate([
    (0, swagger_1.ApiTags)('simulations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)({ path: 'simulations', version: '1' }),
    __metadata("design:paramtypes", [phishing_service_1.PhishingService,
        password_security_service_1.PasswordSecurityService])
], SimulationsController);
//# sourceMappingURL=simulations.controller.js.map