import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { ActionType, ActionRisk } from '../events/entities/user-action.entity';
import { AttackEventType, EventSeverity } from '../events/entities/attack-event.entity';

export interface NetworkAttack {
  id: string;
  type: 'port-scanning' | 'brute-force' | 'ddos-flood';
  ip: string;
  logs: string[];
  description: string;
  severity: EventSeverity;
  correctAction: 'block' | 'monitor' | 'ignore';
}

@Injectable()
export class NetworkAttackService {
  private readonly attacks: NetworkAttack[] = [
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
      severity: EventSeverity.HIGH,
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
      severity: EventSeverity.MEDIUM,
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
      severity: EventSeverity.CRITICAL,
      correctAction: 'block',
    }
  ];

  constructor(private readonly eventsService: EventsService) { }

  async getAttacks() {
    return this.attacks;
  }

  async handleAttack(userId: string, attackId: string, action: 'block' | 'monitor' | 'ignore') {
    const attack = this.attacks.find(a => a.id === attackId);
    if (!attack) throw new NotFoundException('Attack simulation not found');

    const isCorrect = action === attack.correctAction;

    // Log the user action
    await this.eventsService.logAction(userId, {
      scenarioId: null,
      actionType: ActionType.WAF_RULE_CREATED, // Closest type
      risk: isCorrect ? ActionRisk.SAFE : ActionRisk.DANGEROUS,
      isCorrect,
      metadata: { attackId, action, attackType: attack.type },
      pointsDelta: isCorrect ? 150 : -75,
    });

    // Log attack event
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

  private mapAttackType(type: string): AttackEventType {
    switch (type) {
      case 'brute-force': return AttackEventType.BRUTE_FORCE;
      case 'ddos-flood': return AttackEventType.DOS_ATTACK;
      default: return AttackEventType.PORT_SCAN;
    }
  }

  private getAnalysis(attack: NetworkAttack, action: string) {
    if (action === attack.correctAction) {
      return `Parabéns! Você tomou a decisão correta. ${this.getActionJustification(attack.correctAction)}`;
    }
    return `Incorreto. Para um ataque de ${attack.type}, a ação recomendada seria ${attack.correctAction}.`;
  }

  private getActionJustification(action: string) {
    switch (action) {
      case 'block': return 'Bloquear o IP é essencial para mitigar ataques ativos que tentam comprometer o sistema ou causar indisponibilidade.';
      case 'monitor': return 'Monitorar é ideal para escaneamentos vindos de redes internas, onde o IP pode ser de um colega ou dispositivo legítimo fazendo varreduras por engano.';
      case 'ignore': return 'Ignorar só é aceitável para alertas de baixo risco já conhecidos, o que não era o caso aqui.';
      default: return '';
    }
  }
}
