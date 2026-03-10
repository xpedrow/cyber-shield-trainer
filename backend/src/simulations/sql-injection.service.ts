import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { ActionType, ActionRisk } from '../events/entities/user-action.entity';
import { AttackEventType, EventSeverity } from '../events/entities/attack-event.entity';

export interface SqlInjectionScenario {
  id: string;
  vulnerableQuery: string;
  description: string;
  hints: string[];
  correctInjection: string;
  explanation: string;
  severity: EventSeverity;
}

@Injectable()
export class SqlInjectionService {
  private readonly scenarios: SqlInjectionScenario[] = [
    {
      id: 'login-bypass',
      vulnerableQuery: "SELECT * FROM users WHERE username = '[USER_INPUT]' AND password = '[PASS_INPUT]'",
      description: 'Formulário de login vulnerável a injeção SQL. Tente fazer login sem credenciais válidas.',
      hints: [
        'O código concatena entrada do usuário diretamente na query',
        'Use aspas simples para quebrar a string',
        'Comentários SQL podem ajudar a ignorar partes da query'
      ],
      correctInjection: "' OR '1'='1' --",
      explanation: 'Esta injeção faz com que a condição WHERE seja sempre verdadeira, permitindo login sem credenciais. Use prepared statements para prevenir.',
      severity: EventSeverity.CRITICAL
    },
    {
      id: 'data-dump',
      vulnerableQuery: "SELECT * FROM products WHERE name LIKE '%[SEARCH_TERM]%'",
      description: 'Campo de busca vulnerável. Tente extrair todos os dados da tabela.',
      hints: [
        'O LIKE usa % como wildcard',
        'Você pode fechar a string e adicionar sua própria query',
        'UNION SELECT pode combinar resultados de múltiplas tabelas'
      ],
      correctInjection: "%' UNION SELECT username, password FROM users --",
      explanation: 'UNION SELECT permite combinar resultados de diferentes tabelas, vazando dados de usuários. Sempre valide e sanitize entradas.',
      severity: EventSeverity.HIGH
    },
    {
      id: 'blind-injection',
      vulnerableQuery: "SELECT id FROM news WHERE id = [NEWS_ID]",
      description: 'Página de notícias vulnerável a injeção. Tente descobrir informações sobre o banco.',
      hints: [
        'Sem aspas, você pode injetar diretamente',
        'Comentários podem esconder o resto da query',
        'Funções como database() revelam informações'
      ],
      correctInjection: "1 AND 1=0 UNION SELECT database(), user(), version() --",
      explanation: 'Injeções cegas não mostram resultados diretamente, mas funções como database() revelam metadados. Sempre use parameterized queries.',
      severity: EventSeverity.MEDIUM
    }
  ];

  getScenarios(): SqlInjectionScenario[] {
    return this.scenarios;
  }

  getScenarioById(id: string): SqlInjectionScenario {
    const scenario = this.scenarios.find(s => s.id === id);
    if (!scenario) {
      throw new NotFoundException('Cenário de SQL Injection não encontrado');
    }
    return scenario;
  }

  testInjection(userId: string, scenarioId: string, injection: string): any {
    const scenario = this.getScenarioById(scenarioId);

    // Simulate SQL execution (simplified)
    const isSuccessful = this.simulateInjection(scenario, injection);

    // Log the action
    this.eventsService.logAction(userId, {
      actionType: ActionType.SECURITY_TEST,
      risk: isSuccessful ? ActionRisk.HIGH : ActionRisk.LOW,
      metadata: {
        scenarioId,
        injection,
        successful: isSuccessful,
        severity: scenario.severity,
        description: `Teste de SQL Injection: ${scenario.description}`
      }
    });

    // Create attack event if successful
    if (isSuccessful) {
      this.eventsService.logAttack(userId, {
        eventType: AttackEventType.SQL_INJECTION,
        severity: scenario.severity,
        title: `SQL Injection bem-sucedida detectada`,
        description: `SQL Injection bem-sucedida detectada`,
        payload: {
          scenarioId,
          injection,
          vulnerableQuery: scenario.vulnerableQuery
        }
      });
    }

    return {
      successful: isSuccessful,
      feedback: isSuccessful
        ? 'Injeção bem-sucedida! ' + scenario.explanation
        : 'Injeção falhou. Tente novamente com uma abordagem diferente.',
      xp: isSuccessful ? 75 : 5,
      scenario,
      simulatedResult: isSuccessful ? this.getSimulatedResult(scenario, injection) : null
    };
  }

  private simulateInjection(scenario: SqlInjectionScenario, injection: string): boolean {
    // Simplified simulation - in real scenario, this would execute against a test database
    const normalizedInjection = injection.toLowerCase().trim();
    const normalizedCorrect = scenario.correctInjection.toLowerCase().trim();

    // Basic pattern matching for demonstration
    if (scenario.id === 'login-bypass') {
      return normalizedInjection.includes("' or '1'='1") || normalizedInjection.includes("or 1=1");
    }
    if (scenario.id === 'data-dump') {
      return normalizedInjection.includes("union select") && normalizedInjection.includes("from users");
    }
    if (scenario.id === 'blind-injection') {
      return normalizedInjection.includes("union select") && (
        normalizedInjection.includes("database()") ||
        normalizedInjection.includes("user()") ||
        normalizedInjection.includes("version()")
      );
    }

    return false;
  }

  private getSimulatedResult(scenario: SqlInjectionScenario, injection: string): any {
    if (scenario.id === 'login-bypass') {
      return {
        message: 'Login successful',
        user: 'admin',
        role: 'administrator'
      };
    }
    if (scenario.id === 'data-dump') {
      return {
        products: [
          { id: 1, name: 'Product A', price: 99.99 },
          { id: 2, name: 'Product B', price: 149.99 }
        ],
        users: [
          { username: 'admin', password: 'hashed_pass_123' },
          { username: 'user1', password: 'pass456' }
        ]
      };
    }
    if (scenario.id === 'blind-injection') {
      return {
        database: 'cyber_shield_db',
        user: 'webapp_user@localhost',
        version: 'MySQL 8.0.33'
      };
    }
    return null;
  }

  constructor(private readonly eventsService: EventsService) {}
}