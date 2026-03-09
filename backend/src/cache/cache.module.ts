import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        store: redisStore,
        host: cfg.get('REDIS_HOST', 'localhost'),
        port: cfg.get('REDIS_PORT', 6379),
        ttl: cfg.get('CACHE_TTL', 600), // 10 minutes
      }),
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
