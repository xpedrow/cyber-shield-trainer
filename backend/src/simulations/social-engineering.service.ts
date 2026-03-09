import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { ActionType, ActionRisk } from '../events/entities/user-action.entity';
import { AttackEventType, EventSeverity } from '../events/entities/attack-event.entity';

export interface SocialEngineeringScenario {
  id: string;
  title: string;
  message: string;
  sender: string;
  channel: 'SMS' | 'WhatsApp' | 'Phone' | 'Chat';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    impact: string;
    risk: ActionRisk;
  }[];
  analysis: string;
}

@Injectable()
export class SocialEngineeringService {
  private readonly scenarios: SocialEngineeringScenario[] = [
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
          risk: ActionRisk.DANGEROUS,
        },
        {
          id: 'refuse',
          text: 'recusar',
          isCorrect: true,
          impact: 'Ataque interrompido. Você protegeu suas credenciais e os ativos da empresa.',
          risk: ActionRisk.SAFE,
        },
        {
          id: 'verify',
          text: 'pedir verificação',
          isCorrect: true,
          impact: 'Melhor prática. Ao solicitar um ticket oficial, você desmascara o golpista sem ser rude.',
          risk: ActionRisk.SAFE,
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
          risk: ActionRisk.DANGEROUS,
        },
        {
          id: 'ignore-report',
          text: 'Denunciar e bloquear',
          isCorrect: true,
          impact: 'Telefone do atacante bloqueado. Você evitou prejuízo financeiro.',
          risk: ActionRisk.SAFE,
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
          risk: ActionRisk.DANGEROUS,
        },
        {
          id: 'verify-call',
          text: 'Ligar para o número conhecido dele',
          isCorrect: true,
          impact: 'Você confirma que o número no WhatsApp é falso (Business Account Fake).',
          risk: ActionRisk.SAFE,
        }
      ],
      analysis: 'Ataques de Business Email Compromise (BEC) ou personificação por WhatsApp usam hierarquia e urgência para impedir que o funcionário pense racionalmente.',
    }
  ];

  constructor(private readonly eventsService: EventsService) {}

  async getScenarios() {
    return this.scenarios;
  }

  async playScenario(userId: string, scenarioId: string, optionId: string) {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (!scenario) throw new NotFoundException('Scenario not found');

    const option = scenario.options.find(o => o.id === optionId);
    if (!option) throw new NotFoundException('Option not found');

    // Log the user action
    await this.eventsService.logAction(userId, {
      scenarioId: null,
      actionType: ActionType.GENERAL_INTERACTION,
      risk: option.risk,
      isCorrect: option.isCorrect,
      metadata: { scenarioId, optionId, channel: scenario.channel },
      pointsDelta: option.isCorrect ? 100 : -50,
    });

    // Log attack event if incorrect
    if (!option.isCorrect) {
      await this.eventsService.logAttack(userId, {
        eventType: AttackEventType.SOCIAL_ENGINEERING,
        severity: EventSeverity.MEDIUM,
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
}
