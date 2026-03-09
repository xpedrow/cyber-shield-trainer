import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Score } from '../scores/entities/score.entity';
import { AttackEvent, EventSeverity } from '../events/entities/attack-event.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Score) private readonly scoreRepo: Repository<Score>,
    @InjectRepository(AttackEvent) private readonly attackRepo: Repository<AttackEvent>,
  ) {}

  async getGlobalSummary() {
    const totalUsers = await this.userRepo.count();
    const totalSimulations = await this.scoreRepo.count();
    const avgScore = await this.scoreRepo.average('score');
    
    // Critical attacks in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const criticalAttacks = await this.attackRepo.count({
      where: { 
        severity: EventSeverity.CRITICAL,
        createdAt: Between(thirtyDaysAgo, new Date())
      }
    });

    return {
      totalUsers,
      totalSimulations,
      avgScore: Math.round(avgScore || 0),
      criticalAttacksLastMonth: criticalAttacks,
    };
  }

  async getUserProgress(userId: string) {
    const scores = await this.scoreRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
      select: ['score', 'createdAt', 'accuracy'],
    });

    // Group by week or just return last 10 for chart
    return {
      history: scores.slice(-20),
      currentLevel: (await this.userRepo.findOne({ where: { id: userId }, select: ['level'] }))?.level,
    };
  }
}
