import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { CreateScoreDto } from './dto/create-score.dto';
import { ScenariosService } from '../scenarios/scenarios.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepo: Repository<Score>,
    private readonly scenariosService: ScenariosService,
    private readonly usersService: UsersService,
  ) {}

  async submitScore(userId: string, dto: CreateScoreDto): Promise<Score> {
    const scenario = await this.scenariosService.findOne(dto.scenarioId);
    
    // Safety check
    if (dto.score > scenario.maxScore) {
      throw new BadRequestException('Score cannot exceed max score for this scenario');
    }

    // Logic for best attempt
    const existingBest = await this.scoreRepo.findOne({
      where: { userId, scenarioId: dto.scenarioId, isBest: true },
    });

    const attemptNumber = (await this.scoreRepo.count({ where: { userId, scenarioId: dto.scenarioId } })) + 1;
    const isBest = !existingBest || dto.score > existingBest.score;

    if (isBest && existingBest) {
      existingBest.isBest = false;
      await this.scoreRepo.save(existingBest);
    }

    const accuracy = (dto.score / scenario.maxScore) * 100;
    const xpEarned = Math.floor(scenario.xpReward * (accuracy / 100));

    const score = this.scoreRepo.create({
      ...dto,
      userId,
      maxScore: scenario.maxScore,
      accuracy,
      xpEarned,
      isBest,
      attemptNumber,
    });

    const savedScore = await this.scoreRepo.save(score);
    
    // Update user totals and XP
    await this.usersService.addXp(userId, xpEarned);
    await this.scenariosService.incrementPlayCount(dto.scenarioId);

    return savedScore;
  }

  async findByUser(userId: string): Promise<Score[]> {
    return this.scoreRepo.find({
      where: { userId },
      relations: ['scenario'],
      order: { createdAt: 'DESC' },
    });
  }

  async getBestByScenario(userId: string, scenarioId: string): Promise<Score | null> {
    return this.scoreRepo.findOne({
      where: { userId, scenarioId, isBest: true },
    });
  }

  async getGlobalStats(userId: string) {
    const scores = await this.findByUser(userId);
    const totalPoints = scores.reduce((acc, s) => acc + s.score, 0);
    const avgAccuracy = scores.length > 0 ? scores.reduce((acc, s) => acc + s.accuracy, 0) / scores.length : 0;
    
    return {
      scenariosCompleted: scores.length,
      totalPoints,
      avgAccuracy: Math.round(avgAccuracy),
      recentActivity: scores.slice(0, 5),
    };
  }
}
