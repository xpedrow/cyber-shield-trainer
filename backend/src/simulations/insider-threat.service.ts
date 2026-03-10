import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { ActionType, ActionRisk } from '../events/entities/user-action.entity';
import { AttackEventType, EventSeverity } from '../events/entities/attack-event.entity';

export interface InsiderThreat {
  id: string;
  type: 'data-leak' | 'unauthorized-access' | 'policy-violation';
  description: string;
  evidence: string[];
  severity: EventSeverity;
  correctAction: 'investigate' | 'block-access' | 'report' | 'monitor';
  explanation: string;
}

@Injectable()
export class InsiderThreatService {
  private readonly threats: InsiderThreat[] = [
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
      severity: EventSeverity.HIGH,
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
      severity: EventSeverity.CRITICAL,
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
      severity: EventSeverity.MEDIUM,
      correctAction: 'report',
      explanation: 'Compartilhar credenciais viola política de segurança. Notifique o responsável e force mudança de senha para todos os envolvidos.'
    }
  ];

  getThreats(): InsiderThreat[] {
    return this.threats;
  }

  getThreatById(id: string): InsiderThreat {
    const threat = this.threats.find(t => t.id === id);
    if (!threat) {
      throw new NotFoundException('Ameaça interna não encontrada');
    }
    return threat;
  }

  handleThreat(userId: string, threatId: string, action: 'investigate' | 'block-access' | 'report' | 'monitor'): any {
    const threat = this.getThreatById(threatId);

    // Log the action
    this.eventsService.logAction(userId, {
      actionType: ActionType.SECURITY_DECISION,
      risk: action === threat.correctAction ? ActionRisk.LOW : ActionRisk.HIGH,
      metadata: {
        threatId,
        action,
        correct: action === threat.correctAction,
        severity: threat.severity,
        description: `Tratamento de ameaça interna: ${threat.description}`
      }
    });

    // Create attack event
    this.eventsService.logAttack(userId, {
      eventType: AttackEventType.INSIDER_THREAT,
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

  constructor(private readonly eventsService: EventsService) {}
}