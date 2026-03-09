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
exports.Scenario = exports.ScenarioType = exports.ScenarioDifficulty = void 0;
const typeorm_1 = require("typeorm");
const user_action_entity_1 = require("../../events/entities/user-action.entity");
const score_entity_1 = require("../../scores/entities/score.entity");
var ScenarioDifficulty;
(function (ScenarioDifficulty) {
    ScenarioDifficulty["LOW"] = "low";
    ScenarioDifficulty["MEDIUM"] = "medium";
    ScenarioDifficulty["HIGH"] = "high";
    ScenarioDifficulty["CRITICAL"] = "critical";
})(ScenarioDifficulty || (exports.ScenarioDifficulty = ScenarioDifficulty = {}));
var ScenarioType;
(function (ScenarioType) {
    ScenarioType["PHISHING_EMAIL"] = "phishing_email";
    ScenarioType["FAKE_LOGIN"] = "fake_login";
    ScenarioType["SOCIAL_ENGINEERING"] = "social_engineering";
    ScenarioType["RANSOMWARE"] = "ransomware";
    ScenarioType["BRUTE_FORCE"] = "brute_force";
    ScenarioType["INSIDER_THREAT"] = "insider_threat";
    ScenarioType["SQL_INJECTION"] = "sql_injection";
})(ScenarioType || (exports.ScenarioType = ScenarioType = {}));
let Scenario = class Scenario {
};
exports.Scenario = Scenario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Scenario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Scenario.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Scenario.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScenarioType }),
    __metadata("design:type", String)
], Scenario.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScenarioDifficulty }),
    __metadata("design:type", String)
], Scenario.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Scenario.prototype, "maxScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Scenario.prototype, "xpReward", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Scenario.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Scenario.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: '{}' }),
    __metadata("design:type", Array)
], Scenario.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Scenario.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Scenario.prototype, "timesPlayed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Scenario.prototype, "avgScore", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_action_entity_1.UserAction, (action) => action.scenario),
    __metadata("design:type", Array)
], Scenario.prototype, "actions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => score_entity_1.Score, (score) => score.scenario),
    __metadata("design:type", Array)
], Scenario.prototype, "scores", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Scenario.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Scenario.prototype, "updatedAt", void 0);
exports.Scenario = Scenario = __decorate([
    (0, typeorm_1.Entity)('scenarios'),
    (0, typeorm_1.Index)(['type'])
], Scenario);
//# sourceMappingURL=scenario.entity.js.map