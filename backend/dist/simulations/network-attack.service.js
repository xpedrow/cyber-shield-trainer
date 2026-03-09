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
exports.NetworkAttackService = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../events/events.service");
const user_action_entity_1 = require("../events/entities/user-action.entity");
const attack_event_entity_1 = require("../events/entities/attack-event.entity");
let NetworkAttackService = class NetworkAttackService {
    constructor(eventsService) {
        this.eventsService = eventsService;
        this.attacks = [
            {
                id: 'bf-login-01',
                type: 'brute-force',
                ip: '185.203.119.2',
                logs: [
                    '[NOTICE] 2026-03-09 10:00:01 - Failed login attempt for user "admin" from 185.203.119.2',
                    '[NOTICE] 2026-03-09 10:00:02 - Failed login attempt for user "root" from 185.203.119.2',
                    '[NOTICE] 2026-03-09 10:00:03 - Failed login attempt for user "manager" from 185.203.119.2',
                    '[WARNING] 2026-03-09 10:00:10 - 120 failed login attempts in 10 seconds from 185.203.119.2',
                ],
                description: 'Múltiplas tentativas de login falhas detectadas em curto intervalo de tempo.',
                severity: attack_event_entity_1.EventSeverity.HIGH,
                correctAction: 'block',
            },
            {
                id: 'ps-internal-01',
                type: 'port-scanning',
                ip: '10.0.0.45',
                logs: [
                    '[INFO] TCP Connection attempt on port 21 (FTP) from 10.0.0.45',
                    '[INFO] TCP Connection attempt on port 22 (SSH) from 10.0.0.45',
                    '[INFO] TCP Connection attempt on port 23 (Telnet) from 10.0.0.45',
                    '[INFO] TCP Connection attempt on port 80 (HTTP) from 10.0.0.45',
                ],
                description: 'Varredura de portas (Port Scanning) sequencial detectada vindo de IP interno.',
                severity: attack_event_entity_1.EventSeverity.MEDIUM,
                correctAction: 'monitor',
            },
            {
                id: 'flood-ext-01',
                type: 'ddos-flood',
                ip: '201.45.1.88',
                logs: [
                    '[ERROR] High HTTP Request rate (500 req/sec) from 201.45.1.88',
                    '[ERROR] Resource depletion: CPU at 95% due to incoming traffic from 201.45.1.88',
                ],
                description: 'Flood de requisições HTTP (Camada 7) causando degradação de performance.',
                severity: attack_event_entity_1.EventSeverity.CRITICAL,
                correctAction: 'block',
            }
        ];
    }
    async getAttacks() {
        return this.attacks;
    }
    async handleAttack(userId, attackId, action) {
        const attack = this.attacks.find(a => a.id === attackId);
        if (!attack)
            throw new common_1.NotFoundException('Attack simulation not found');
        const isCorrect = action === attack.correctAction;
        await this.eventsService.logAction(userId, {
            scenarioId: null,
            actionType: user_action_entity_1.ActionType.WAF_RULE_CREATED,
            risk: isCorrect ? user_action_entity_1.ActionRisk.SAFE : user_action_entity_1.ActionRisk.DANGEROUS,
            isCorrect,
            metadata: { attackId, action, attackType: attack.type },
            pointsDelta: isCorrect ? 150 : -75,
        });
        await this.eventsService.logAttack(userId, {
            eventType: this.mapAttackType(attack.type),
            severity: attack.severity,
            title: `Simulação IDS: ${attack.type}`,
            description: `Resposta do usuário: ${action}. Correto: ${attack.correctAction}`,
            wasDetected: true,
            payload: { attackId, action, ip: attack.ip }
        });
        return {
            success: isCorrect,
            analysis: this.getAnalysis(attack, action),
            attack
        };
    }
    mapAttackType(type) {
        switch (type) {
            case 'brute-force': return attack_event_entity_1.AttackEventType.BRUTE_FORCE;
            case 'ddos-flood': return attack_event_entity_1.AttackEventType.DOS_ATTACK;
            default: return attack_event_entity_1.AttackEventType.PORT_SCAN;
        }
    }
    getAnalysis(attack, action) {
        if (action === attack.correctAction) {
            return `Parabéns! Você tomou a decisão correta. ${this.getActionJustification(attack.correctAction)}`;
        }
        return `Incorreto. Para um ataque de ${attack.type}, a ação recomendada seria ${attack.correctAction}.`;
    }
    getActionJustification(action) {
        switch (action) {
            case 'block': return 'Bloquear o IP é essencial para mitigar ataques ativos que tentam comprometer o sistema ou causar indisponibilidade.';
            case 'monitor': return 'Monitorar é ideal para escaneamentos vindos de redes internas, onde o IP pode ser de um colega ou dispositivo legítimo fazendo varreduras por engano.';
            case 'ignore': return 'Ignorar só é aceitável para alertas de baixo risco já conhecidos, o que não era o caso aqui.';
            default: return '';
        }
    }
};
exports.NetworkAttackService = NetworkAttackService;
exports.NetworkAttackService = NetworkAttackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], NetworkAttackService);
//# sourceMappingURL=network-attack.service.js.map