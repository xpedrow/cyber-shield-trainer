import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      useFactory: (cfg: ConfigService) => ({
        type: cfg.get<'sqlite' | 'postgres'>('DB_TYPE', 'sqlite'),
        host: cfg.get<string>('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get<string>('DB_USER'),
        password: cfg.get<string>('DB_PASSWORD'),
        database: cfg.get<string>('DB_NAME') || cfg.get<string>('DATABASE_PATH') || 'database.sqlite',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: true, // Auto-create tables for easier training setup
        logging: cfg.get('NODE_ENV') === 'development',
      }),
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
