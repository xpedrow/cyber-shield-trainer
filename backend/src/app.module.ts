import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ScenariosModule } from './scenarios/scenarios.module';
import { ScoresModule } from './scores/scores.module';
import { EventsModule } from './events/events.module';
import { ReportsModule } from './reports/reports.module';
import { CacheModule } from './cache/cache.module';
import { SimulationsModule } from './simulations/simulations.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (PostgreSQL via TypeORM)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): TypeOrmModuleOptions => {
        // 1. Tenta DATABASE_URL ou POSTGRES_URL (Padrão Railway/Vercel)
        const databaseUrl = cfg.get<string>('DATABASE_URL') || cfg.get<string>('POSTGRES_URL');
        
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          };
        }

        // 2. Tenta variáveis individuais (Padrão Railway: PGHOST, PGUSER, etc.)
        const host = cfg.get<string>('PGHOST') || cfg.get<string>('DB_HOST');
        const username = cfg.get<string>('PGUSER') || cfg.get<string>('DB_USER');
        const password = cfg.get<string>('PGPASSWORD') || cfg.get<string>('DB_PASSWORD');
        const database = cfg.get<string>('PGDATABASE') || cfg.get<string>('DB_NAME') || 'cyber_shield';
        const port = cfg.get<number>('PGPORT') || cfg.get<number>('DB_PORT') || 5432;

        if (host && username) {
          return {
            type: 'postgres',
            host,
            port,
            username,
            password,
            database,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          };
        }

        // 3. Fallback para SQLite se nada for encontrado
        return {
          type: 'sqlite',
          database: cfg.get<string>('DATABASE_PATH') || 'database.sqlite',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),

    // Feature modules
    CacheModule,
    AuthModule,
    UsersModule,
    ScenariosModule,
    ScoresModule,
    EventsModule,
    ReportsModule,
    SimulationsModule,
  ],
})
export class AppModule {}
