import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { User } from '../users/entities/user.entity';
import { Score } from '../scores/entities/score.entity';
import { AttackEvent } from '../events/entities/attack-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Score, AttackEvent])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
