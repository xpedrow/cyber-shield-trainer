import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAction } from './entities/user-action.entity';
import { AttackEvent } from './entities/attack-event.entity';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { CreateAttackEventDto } from './dto/create-attack-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(UserAction)
    private readonly actionRepo: Repository<UserAction>,
    @InjectRepository(AttackEvent)
    private readonly attackRepo: Repository<AttackEvent>,
  ) {}

  async logAction(userId: string, dto: CreateUserActionDto): Promise<UserAction> {
    const action = this.actionRepo.create({ ...dto, userId });
    return this.actionRepo.save(action);
  }

  async logAttack(userId: string | null, dto: CreateAttackEventDto): Promise<AttackEvent> {
    const attack = this.attackRepo.create({ ...dto, userId });
    return this.attackRepo.save(attack);
  }

  async getRecentActions(userId: string, limit = 20): Promise<UserAction[]> {
    return this.actionRepo.find({
      where: { userId },
      relations: ['scenario'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRecentAttacks(userId?: string, limit = 50): Promise<AttackEvent[]> {
    const where = userId ? { userId } : {};
    return this.attackRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getSecurityLog(userId?: string, limit = 100) {
    const attacks = await this.getRecentAttacks(userId, limit);
    return attacks.map(a => ({
      id: a.id,
      timestamp: a.createdAt,
      type: 'attack',
      severity: a.severity,
      title: a.title,
      description: a.description,
      detected: a.wasDetected,
    }));
  }
}
