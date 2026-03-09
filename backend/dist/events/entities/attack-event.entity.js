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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackEvent = exports.AttackEventType = exports.EventSeverity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var EventSeverity;
(function (EventSeverity) {
    EventSeverity["INFO"] = "info";
    EventSeverity["LOW"] = "low";
    EventSeverity["MEDIUM"] = "medium";
    EventSeverity["HIGH"] = "high";
    EventSeverity["CRITICAL"] = "critical";
})(EventSeverity || (exports.EventSeverity = EventSeverity = {}));
var AttackEventType;
(function (AttackEventType) {
    AttackEventType["PHISHING_ATTEMPT"] = "phishing_attempt";
    AttackEventType["CREDENTIAL_THEFT"] = "credential_theft";
    AttackEventType["MALWARE_SIMULATED"] = "malware_simulated";
    AttackEventType["SOCIAL_ENGINEERING"] = "social_engineering";
    AttackEventType["BRUTE_FORCE"] = "brute_force";
    AttackEventType["RANSOMWARE_SIMULATED"] = "ransomware_simulated";
    AttackEventType["SQL_INJECTION"] = "sql_injection";
})(AttackEventType || (exports.AttackEventType = AttackEventType = {}));
let AttackEvent = class AttackEvent {
};
exports.AttackEvent = AttackEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AttackEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], AttackEvent.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], AttackEvent.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AttackEventType }),
    __metadata("design:type", String)
], AttackEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventSeverity, default: EventSeverity.INFO }),
    __metadata("design:type", String)
], AttackEvent.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], AttackEvent.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AttackEvent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttackEvent.prototype, "sourceIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], AttackEvent.prototype, "wasDetected", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AttackEvent.prototype, "detectionTimeMs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AttackEvent.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttackEvent.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AttackEvent.prototype, "isResolved", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AttackEvent.prototype, "createdAt", void 0);
exports.AttackEvent = AttackEvent = __decorate([
    (0, typeorm_1.Entity)('attack_events'),
    (0, typeorm_1.Index)(['userId', 'createdAt']),
    (0, typeorm_1.Index)(['severity', 'createdAt'])
], AttackEvent);
//# sourceMappingURL=attack-event.entity.js.map