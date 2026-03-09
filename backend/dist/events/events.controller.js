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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const events_service_1 = require("./events.service");
const create_user_action_dto_1 = require("./dto/create-user-action.dto");
const create_attack_event_dto_1 = require("./dto/create-attack-event.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let EventsController = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    logAction(req, dto) {
        return this.eventsService.logAction(req.user.userId, dto);
    }
    logAttack(req, dto) {
        return this.eventsService.logAttack(req.user.userId, dto);
    }
    getMyActions(req, limit) {
        return this.eventsService.getRecentActions(req.user.userId, limit);
    }
    getLog(limit, userId) {
        return this.eventsService.getSecurityLog(userId, limit);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)('action'),
    (0, swagger_1.ApiOperation)({ summary: 'Log a user action during a scenario' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_action_dto_1.CreateUserActionDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "logAction", null);
__decorate([
    (0, common_1.Post)('attack'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ANALYST),
    (0, swagger_1.ApiOperation)({ summary: 'Log a simulated attack event' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_attack_event_dto_1.CreateAttackEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "logAttack", null);
__decorate([
    (0, common_1.Get)('me/actions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my recent simulation actions' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getMyActions", null);
__decorate([
    (0, common_1.Get)('log'),
    (0, swagger_1.ApiOperation)({ summary: 'Get security events log' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getLog", null);
exports.EventsController = EventsController = __decorate([
    (0, swagger_1.ApiTags)('events'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)({ path: 'events', version: '1' }),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map