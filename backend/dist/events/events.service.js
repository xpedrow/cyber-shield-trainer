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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_action_entity_1 = require("./entities/user-action.entity");
const attack_event_entity_1 = require("./entities/attack-event.entity");
let EventsService = class EventsService {
    constructor(actionRepo, attackRepo) {
        this.actionRepo = actionRepo;
        this.attackRepo = attackRepo;
    }
    async logAction(userId, dto) {
        const action = this.actionRepo.create({ ...dto, userId });
        return this.actionRepo.save(action);
    }
    async logAttack(userId, dto) {
        const attack = this.attackRepo.create({ ...dto, userId });
        return this.attackRepo.save(attack);
    }
    async getRecentActions(userId, limit = 20) {
        return this.actionRepo.find({
            where: { userId },
            relations: ['scenario'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getRecentAttacks(userId, limit = 50) {
        const where = userId ? { userId } : {};
        return this.attackRepo.find({
            where,
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getSecurityLog(userId, limit = 100) {
        const attacks = await this.getRecentAttacks(userId, limit);
        return attacks.map(a => ({
            id: a.id,
            timestamp: a.createdAt,
            type: 'attack',
            severity: a.severity,
            title: a.title,
            description: a.description,
            detected: a.wasDetected,
        }));
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_action_entity_1.UserAction)),
    __param(1, (0, typeorm_1.InjectRepository)(attack_event_entity_1.AttackEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=events.service.js.map