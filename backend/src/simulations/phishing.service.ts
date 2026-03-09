import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { ActionType, ActionRisk } from '../events/entities/user-action.entity';
import { AttackEventType, EventSeverity } from '../events/entities/attack-event.entity';

export interface PhishingEmail {
  id: string;
  subject: string;
  sender: string;
  content: string;
  redFlags: string[];
  explanation: string;
  targetUrl: string;
  isPhishing: boolean;
}

@Injectable()
export class PhishingService {
  private readonly templates: PhishingEmail[] = [
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

  constructor(private readonly eventsService: EventsService) {}

  async getTemplates() {
    return this.templates;
  }

  async getTemplate(id: string) {
    const template = this.templates.find(t => t.id === id);
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async trackAction(userId: string, emailId: string, action: 'click' | 'report' | 'ignore', metadata: any) {
    const email = await this.getTemplate(emailId);
    
    let actionType: ActionType;
    let risk: ActionRisk = ActionRisk.SAFE;
    let isCorrect = false;

    if (action === 'click') {
      actionType = ActionType.LINK_CLICKED;
      risk = email.isPhishing ? ActionRisk.DANGEROUS : ActionRisk.SAFE;
      isCorrect = !email.isPhishing;
    } else if (action === 'report') {
      actionType = ActionType.EMAIL_REPORTED;
      isCorrect = email.isPhishing;
    } else {
      actionType = ActionType.EMAIL_DELETED; // simplified for ignore
      isCorrect = email.isPhishing;
    }

    // Log the user action
    await this.eventsService.logAction(userId, {
      scenarioId: null, // Global phishing exercise
      actionType,
      risk,
      isCorrect,
      metadata: { ...metadata, emailId, isPhishing: email.isPhishing },
      pointsDelta: isCorrect ? 50 : -30,
    });

    // If it was a dangerous click on a phishing email, log a security event
    if (action === 'click' && email.isPhishing) {
      await this.eventsService.logAttack(userId, {
        eventType: AttackEventType.PHISHING_ATTEMPT,
        severity: EventSeverity.HIGH,
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
}
