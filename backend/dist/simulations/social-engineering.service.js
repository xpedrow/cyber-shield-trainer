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
exports.SocialEngineeringService = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../events/events.service");
const user_action_entity_1 = require("../events/entities/user-action.entity");
const attack_event_entity_1 = require("../events/entities/attack-event.entity");
let SocialEngineeringService = class SocialEngineeringService {
    constructor(eventsService) {
        this.eventsService = eventsService;
        this.scenarios = [
            {
                id: 'it-support-password',
                title: 'Suporte Técnico Falso',
                message: 'Sou do suporte técnico da empresa. Precisamos da sua senha para atualizar o sistema de segurança do seu departamento remotamente.',
                sender: 'Suporte Interno (via Teams)',
                channel: 'Chat',
                options: [
                    {
                        id: 'give-password',
                        text: 'fornecer senha',
                        isCorrect: false,
                        impact: 'Acesso total concedido ao atacante. Suas credenciais podem ser usadas para exfiltrar dados da empresa.',
                        risk: user_action_entity_1.ActionRisk.DANGEROUS,
                    },
                    {
                        id: 'refuse',
                        text: 'recusar',
                        isCorrect: true,
                        impact: 'Ataque interrompido. Você protegeu suas credenciais e os ativos da empresa.',
                        risk: user_action_entity_1.ActionRisk.SAFE,
                    },
                    {
                        id: 'verify',
                        text: 'pedir verificação',
                        isCorrect: true,
                        impact: 'Melhor prática. Ao solicitar um ticket oficial, você desmascara o golpista sem ser rude.',
                        risk: user_action_entity_1.ActionRisk.SAFE,
                    },
                ],
                analysis: 'O suporte técnico NUNCA solicita sua senha por chat ou telefone. Eles possuem ferramentas para gerenciar seu acesso sem precisar da sua credencial privada.',
            },
            {
                id: 'delivery-sms',
                title: 'Problema na Entrega',
                message: 'Seu pacote de R$ 1.250,00 foi retido na alfândega. Pague a taxa de R$ 25,00 para liberação imediata em: bit.ly/correios-taxa-express',
                sender: 'Correios-Info',
                channel: 'SMS',
                options: [
                    {
                        id: 'click-link',
                        text: 'Clicar no link e pagar',
                        isCorrect: false,
                        impact: 'Dados do cartão de crédito roubados. Você acaba de cair em um golpe de Smishing.',
                        risk: user_action_entity_1.ActionRisk.DANGEROUS,
                    },
                    {
                        id: 'ignore-report',
                        text: 'Denunciar e bloquear',
                        isCorrect: true,
                        impact: 'Telefone do atacante bloqueado. Você evitou prejuízo financeiro.',
                        risk: user_action_entity_1.ActionRisk.SAFE,
                    }
                ],
                analysis: 'Órgãos oficiais e grandes e-commerces não pedem pagamentos via links encurtados em SMS. Sempre verifique o rastreamento no site oficial.',
            },
            {
                id: 'ceo-emergency',
                title: 'Urgência do CEO',
                message: 'Olá, sou o [Nome do CEO]. Estou em uma reunião importante e preciso que você compre 5 cartões de presente da Apple agora e me envie os códigos. Reembolsarei em 1 hora. É urgente!',
                sender: 'Diretoria Executiva',
                channel: 'WhatsApp',
                options: [
                    {
                        id: 'execute-order',
                        text: 'Executar pedido agora',
                        isCorrect: false,
                        impact: 'Prejuízo financeiro direto. O golpista desaparece assim que recebe os códigos.',
                        risk: user_action_entity_1.ActionRisk.DANGEROUS,
                    },
                    {
                        id: 'verify-call',
                        text: 'Ligar para o número conhecido dele',
                        isCorrect: true,
                        impact: 'Você confirma que o número no WhatsApp é falso (Business Account Fake).',
                        risk: user_action_entity_1.ActionRisk.SAFE,
                    }
                ],
                analysis: 'Ataques de Business Email Compromise (BEC) ou personificação por WhatsApp usam hierarquia e urgência para impedir que o funcionário pense racionalmente.',
            }
        ];
    }
    async getScenarios() {
        return this.scenarios;
    }
    async playScenario(userId, scenarioId, optionId) {
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        if (!scenario)
            throw new common_1.NotFoundException('Scenario not found');
        const option = scenario.options.find(o => o.id === optionId);
        if (!option)
            throw new common_1.NotFoundException('Option not found');
        await this.eventsService.logAction(userId, {
            scenarioId: null,
            actionType: user_action_entity_1.ActionType.GENERAL_INTERACTION,
            risk: option.risk,
            isCorrect: option.isCorrect,
            metadata: { scenarioId, optionId, channel: scenario.channel },
            pointsDelta: option.isCorrect ? 100 : -50,
        });
        if (!option.isCorrect) {
            await this.eventsService.logAttack(userId, {
                eventType: attack_event_entity_1.AttackEventType.SOCIAL_ENGINEERING,
                severity: attack_event_entity_1.EventSeverity.MEDIUM,
                title: `Vulnerabilidade: ${scenario.title}`,
                description: `Usuário cedeu a manipulação psicológica: ${option.text}`,
                wasDetected: false,
                payload: { scenarioId, optionId }
            });
        }
        return {
            success: option.isCorrect,
            impact: option.impact,
            analysis: scenario.analysis,
            optionSelected: option,
            scenario
        };
    }
};
exports.SocialEngineeringService = SocialEngineeringService;
exports.SocialEngineeringService = SocialEngineeringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], SocialEngineeringService);
//# sourceMappingURL=social-engineering.service.js.map