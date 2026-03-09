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
exports.PhishingService = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../events/events.service");
const user_action_entity_1 = require("../events/entities/user-action.entity");
const attack_event_entity_1 = require("../events/entities/attack-event.entity");
let PhishingService = class PhishingService {
    constructor(eventsService) {
        this.eventsService = eventsService;
        this.templates = [
            {
                id: 'bank-suspension',
                subject: '⚠️ AÇÃO REQUERIDA: Sua conta foi suspensa',
                sender: 'seguranca@itau-banco-online.net',
                content: 'Detectamos um acesso não autorizado em sua conta. Por segurança, ela foi suspensa temporariamente. Para desbloquear, clique no link abaixo e valide seus dados.',
                redFlags: [
                    'Domínio do remetente suspeito (.net em vez de .com.br)',
                    'Senso de urgência artificial ("Ação Requerida", "Imediatamente")',
                    'Saudação genérica',
                    'Link direciona para um domínio diferente do oficial'
                ],
                explanation: 'Bancos nunca solicitam desbloqueio de conta via e-mail com links diretos. Sempre verifique o domínio oficial.',
                targetUrl: 'https://itau-desbloqueio-seguro.com/login',
                isPhishing: true,
            },
            {
                id: 'invoice-pending',
                subject: 'Fatura em Atraso - Referente a Fev/2026',
                sender: 'financeiro@cloud-services-billing.com',
                content: 'Prezado cliente, informamos que o pagamento da fatura vencida em 05/02 ainda não foi identificado. Evite multas clicando aqui para baixar o boleto.',
                redFlags: [
                    'Anexo ou link para "boleto" sem detalhamento do serviço',
                    'Endereço de e-mail não corresponde à empresa contratada',
                    'Ameaça de multas para forçar o clique'
                ],
                explanation: 'Ataques de faturas falsas são comuns. Verifique sempre o CNPJ do emissor no boleto.',
                targetUrl: 'https://cdn-invoices-verify.net/download?id=992',
                isPhishing: true,
            },
            {
                id: 'password-reset-real',
                subject: 'Sua senha do GitHub foi alterada',
                sender: 'noreply@github.com',
                content: 'Olá, informamos que a senha da sua conta foi alterada com sucesso. Se não foi você, clique aqui para reverter.',
                redFlags: [],
                explanation: 'E-mail legítimo do GitHub enviando notificação de segurança padrão.',
                targetUrl: 'https://github.com/settings/security',
                isPhishing: false,
            }
        ];
    }
    async getTemplates() {
        return this.templates;
    }
    async getTemplate(id) {
        const template = this.templates.find(t => t.id === id);
        if (!template)
            throw new common_1.NotFoundException('Template not found');
        return template;
    }
    async trackAction(userId, emailId, action, metadata) {
        const email = await this.getTemplate(emailId);
        let actionType;
        let risk = user_action_entity_1.ActionRisk.SAFE;
        let isCorrect = false;
        if (action === 'click') {
            actionType = user_action_entity_1.ActionType.LINK_CLICKED;
            risk = email.isPhishing ? user_action_entity_1.ActionRisk.DANGEROUS : user_action_entity_1.ActionRisk.SAFE;
            isCorrect = !email.isPhishing;
        }
        else if (action === 'report') {
            actionType = user_action_entity_1.ActionType.EMAIL_REPORTED;
            isCorrect = email.isPhishing;
        }
        else {
            actionType = user_action_entity_1.ActionType.EMAIL_DELETED;
            isCorrect = email.isPhishing;
        }
        await this.eventsService.logAction(userId, {
            scenarioId: null,
            actionType,
            risk,
            isCorrect,
            metadata: { ...metadata, emailId, isPhishing: email.isPhishing },
            pointsDelta: isCorrect ? 50 : -30,
        });
        if (action === 'click' && email.isPhishing) {
            await this.eventsService.logAttack(userId, {
                eventType: attack_event_entity_1.AttackEventType.PHISHING_ATTEMPT,
                severity: attack_event_entity_1.EventSeverity.HIGH,
                title: `Phishing Click: ${email.sender}`,
                description: `Usuário clicou em link malicioso em e-mail simulado de "${email.sender}"`,
                wasDetected: false,
                payload: { emailId, url: email.targetUrl }
            });
        }
        return {
            success: isCorrect,
            analysis: email.explanation,
            redFlags: email.redFlags,
            email
        };
    }
};
exports.PhishingService = PhishingService;
exports.PhishingService = PhishingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], PhishingService);
//# sourceMappingURL=phishing.service.js.map