"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const scenarios_module_1 = require("./scenarios/scenarios.module");
const scores_module_1 = require("./scores/scores.module");
const events_module_1 = require("./events/events.module");
const reports_module_1 = require("./reports/reports.module");
const cache_module_1 = require("./cache/cache.module");
const simulations_module_1 = require("./simulations/simulations.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (cfg) => ({
                    type: 'sqlite',
                    database: cfg.get('DATABASE_PATH') || 'database.sqlite',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                    synchronize: true,
                    logging: cfg.get('NODE_ENV') === 'development',
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                { name: 'short', ttl: 1000, limit: 20 },
                { name: 'long', ttl: 60000, limit: 200 },
            ]),
            cache_module_1.CacheModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            scenarios_module_1.ScenariosModule,
            scores_module_1.ScoresModule,
            events_module_1.EventsModule,
            reports_module_1.ReportsModule,
            simulations_module_1.SimulationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map