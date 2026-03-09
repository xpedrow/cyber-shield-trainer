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
exports.UserAction = exports.ActionRisk = exports.ActionType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const scenario_entity_1 = require("../../scenarios/entities/scenario.entity");
var ActionType;
(function (ActionType) {
    ActionType["EMAIL_OPENED"] = "email_opened";
    ActionType["LINK_CLICKED"] = "link_clicked";
    ActionType["ATTACHMENT_OPENED"] = "attachment_opened";
    ActionType["EMAIL_REPORTED"] = "email_reported";
    ActionType["EMAIL_DELETED"] = "email_deleted";
    ActionType["PHISHING_IDENTIFIED"] = "phishing_identified";
    ActionType["LOGIN_ATTEMPTED"] = "login_attempted";
    ActionType["FAKE_SITE_IDENTIFIED"] = "fake_site_identified";
    ActionType["CREDENTIALS_ENTERED"] = "credentials_entered";
    ActionType["SITE_REPORTED"] = "site_reported";
    ActionType["SCENARIO_STARTED"] = "scenario_started";
    ActionType["SCENARIO_COMPLETED"] = "scenario_completed";
    ActionType["SCENARIO_ABANDONED"] = "scenario_abandoned";
    ActionType["HINT_REQUESTED"] = "hint_requested";
    ActionType["GENERAL_INTERACTION"] = "general_interaction";
    ActionType["WAF_RULE_CREATED"] = "waf_rule_created";
})(ActionType || (exports.ActionType = ActionType = {}));
var ActionRisk;
(function (ActionRisk) {
    ActionRisk["SAFE"] = "safe";
    ActionRisk["WARNING"] = "warning";
    ActionRisk["DANGEROUS"] = "dangerous";
})(ActionRisk || (exports.ActionRisk = ActionRisk = {}));
let UserAction = class UserAction {
};
exports.UserAction = UserAction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserAction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], UserAction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.actions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], UserAction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], UserAction.prototype, "scenarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => scenario_entity_1.Scenario, (s) => s.actions, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'scenarioId' }),
    __metadata("design:type", scenario_entity_1.Scenario)
], UserAction.prototype, "scenario", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: ActionType }),
    __metadata("design:type", String)
], UserAction.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: ActionRisk, default: ActionRisk.SAFE }),
    __metadata("design:type", String)
], UserAction.prototype, "risk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], UserAction.prototype, "pointsDelta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], UserAction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], UserAction.prototype, "responseTimeMs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserAction.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserAction.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserAction.prototype, "createdAt", void 0);
exports.UserAction = UserAction = __decorate([
    (0, typeorm_1.Entity)('user_actions'),
    (0, typeorm_1.Index)(['userId', 'createdAt']),
    (0, typeorm_1.Index)(['scenarioId'])
], UserAction);
//# sourceMappingURL=user-action.entity.js.map