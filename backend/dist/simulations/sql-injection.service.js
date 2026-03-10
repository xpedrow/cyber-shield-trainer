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
exports.SqlInjectionService = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../events/events.service");
const user_action_entity_1 = require("../events/entities/user-action.entity");
const attack_event_entity_1 = require("../events/entities/attack-event.entity");
let SqlInjectionService = class SqlInjectionService {
    getScenarios() {
        return this.scenarios;
    }
    getScenarioById(id) {
        const scenario = this.scenarios.find(s => s.id === id);
        if (!scenario) {
            throw new common_1.NotFoundException('Cenário de SQL Injection não encontrado');
        }
        return scenario;
    }
    testInjection(userId, scenarioId, injection) {
        const scenario = this.getScenarioById(scenarioId);
        const isSuccessful = this.simulateInjection(scenario, injection);
        this.eventsService.logAction(userId, {
            actionType: user_action_entity_1.ActionType.SECURITY_TEST,
            risk: isSuccessful ? user_action_entity_1.ActionRisk.HIGH : user_action_entity_1.ActionRisk.LOW,
            metadata: {
                scenarioId,
                injection,
                successful: isSuccessful,
                severity: scenario.severity,
                description: `Teste de SQL Injection: ${scenario.description}`
            }
        });
        if (isSuccessful) {
            this.eventsService.logAttack(userId, {
                eventType: attack_event_entity_1.AttackEventType.SQL_INJECTION,
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
    simulateInjection(scenario, injection) {
        const normalizedInjection = injection.toLowerCase().trim();
        const normalizedCorrect = scenario.correctInjection.toLowerCase().trim();
        if (scenario.id === 'login-bypass') {
            return normalizedInjection.includes("' or '1'='1") || normalizedInjection.includes("or 1=1");
        }
        if (scenario.id === 'data-dump') {
            return normalizedInjection.includes("union select") && normalizedInjection.includes("from users");
        }
        if (scenario.id === 'blind-injection') {
            return normalizedInjection.includes("union select") && (normalizedInjection.includes("database()") ||
                normalizedInjection.includes("user()") ||
                normalizedInjection.includes("version()"));
        }
        return false;
    }
    getSimulatedResult(scenario, injection) {
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
    constructor(eventsService) {
        this.eventsService = eventsService;
        this.scenarios = [
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
                severity: attack_event_entity_1.EventSeverity.CRITICAL
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
                severity: attack_event_entity_1.EventSeverity.HIGH
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
                severity: attack_event_entity_1.EventSeverity.MEDIUM
            }
        ];
    }
};
exports.SqlInjectionService = SqlInjectionService;
exports.SqlInjectionService = SqlInjectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], SqlInjectionService);
//# sourceMappingURL=sql-injection.service.js.map