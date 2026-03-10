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
exports.InsiderThreatService = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../events/events.service");
const user_action_entity_1 = require("../events/entities/user-action.entity");
const attack_event_entity_1 = require("../events/entities/attack-event.entity");
let InsiderThreatService = class InsiderThreatService {
    getThreats() {
        return this.threats;
    }
    getThreatById(id) {
        const threat = this.threats.find(t => t.id === id);
        if (!threat) {
            throw new common_1.NotFoundException('Ameaça interna não encontrada');
        }
        return threat;
    }
    handleThreat(userId, threatId, action) {
        const threat = this.getThreatById(threatId);
        this.eventsService.logAction(userId, {
            actionType: user_action_entity_1.ActionType.SECURITY_DECISION,
            risk: action === threat.correctAction ? user_action_entity_1.ActionRisk.LOW : user_action_entity_1.ActionRisk.HIGH,
            metadata: {
                threatId,
                action,
                correct: action === threat.correctAction,
                severity: threat.severity,
                description: `Tratamento de ameaça interna: ${threat.description}`
            }
        });
        this.eventsService.logAttack(userId, {
            eventType: attack_event_entity_1.AttackEventType.INSIDER_THREAT,
            severity: threat.severity,
            title: `Ameaça interna detectada: ${threat.type}`,
            description: `Ameaça interna detectada: ${threat.type}`,
            payload: {
                threatId,
                userAction: action,
                correctAction: threat.correctAction
            }
        });
        return {
            success: action === threat.correctAction,
            feedback: action === threat.correctAction
                ? 'Ação correta! ' + threat.explanation
                : 'Ação incorreta. A ação recomendada seria: ' + threat.correctAction + '. ' + threat.explanation,
            xp: action === threat.correctAction ? 50 : 10,
            threat
        };
    }
    constructor(eventsService) {
        this.eventsService = eventsService;
        this.threats = [
            {
                id: 'data-leak-usb',
                type: 'data-leak',
                description: 'Funcionário João Silva foi visto conectando um dispositivo USB não autorizado ao computador corporativo.',
                evidence: [
                    'Log de acesso: João Silva - Conexão USB detectada em 2026-03-10 14:30',
                    'Dispositivo: Kingston DataTraveler 32GB (não listado em ativos autorizados)',
                    'Localização: Escritório Central - Estação 12',
                    'Dados transferidos: ~2.5GB de arquivos confidenciais'
                ],
                severity: attack_event_entity_1.EventSeverity.HIGH,
                correctAction: 'investigate',
                explanation: 'Dispositivos USB não autorizados podem ser usados para exfiltrar dados. Sempre verifique o conteúdo transferido e isole o dispositivo.'
            },
            {
                id: 'unauthorized-access',
                type: 'unauthorized-access',
                description: 'Acesso a dados de RH por funcionário do departamento de vendas sem autorização.',
                evidence: [
                    'Log de acesso: Maria Santos (Vendas) acessou pasta RH/Salários/',
                    'Permissões: Maria não tem acesso autorizado a dados de RH',
                    'Horário: Fora do expediente (22:15)',
                    'Origem: IP externo (VPN não autorizada)'
                ],
                severity: attack_event_entity_1.EventSeverity.CRITICAL,
                correctAction: 'block-access',
                explanation: 'Acesso não autorizado a dados sensíveis viola políticas de segurança. Bloqueie imediatamente o acesso e inicie investigação.'
            },
            {
                id: 'policy-violation',
                type: 'policy-violation',
                description: 'Compartilhamento de credenciais corporativas em chat não criptografado.',
                evidence: [
                    'Mensagem detectada: "Minha senha do sistema é Pass123! Mudem urgente"',
                    'Plataforma: WhatsApp (não autorizada para dados corporativos)',
                    'Participantes: 5 funcionários',
                    'Contexto: Discussão sobre atualização de sistema'
                ],
                severity: attack_event_entity_1.EventSeverity.MEDIUM,
                correctAction: 'report',
                explanation: 'Compartilhar credenciais viola política de segurança. Notifique o responsável e force mudança de senha para todos os envolvidos.'
            }
        ];
    }
};
exports.InsiderThreatService = InsiderThreatService;
exports.InsiderThreatService = InsiderThreatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], InsiderThreatService);
//# sourceMappingURL=insider-threat.service.js.map