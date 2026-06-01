import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scenario } from './entities/scenario.entity';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';

@Injectable()
export class ScenariosService {
  constructor(
    @InjectRepository(Scenario)
    private readonly scenarioRepo: Repository<Scenario>,
  ) {}

  async onModuleInit() {
    const count = await this.scenarioRepo.count();
    if (count === 0) {
      console.log('🌱 Semeando cenários padrão...');
      await this.create({
        title: 'Simulador de Login',
        description: 'Identifique páginas de login falsas e proteja suas credenciais.',
        type: 'fake_login' as any,
        difficulty: 'medium' as any,
        maxScore: 1000,
        xpReward: 500,
        durationSeconds: 300,
      });
      await this.create({
        title: 'Simulador de E-mail',
        description: 'Analise e-mails suspeitos e detecte tentativas de phishing.',
        type: 'phishing_email' as any,
        difficulty: 'low' as any,
        maxScore: 1000,
        xpReward: 300,
        durationSeconds: 300,
      });
    }
  }

  async create(dto: CreateScenarioDto): Promise<Scenario> {
    const scenario = this.scenarioRepo.create(dto);
    return this.scenarioRepo.save(scenario);
  }

  async findAll(isActive?: boolean): Promise<Scenario[]> {
    const where = isActive !== undefined ? { isActive } : {};
    return this.scenarioRepo.find({ where, order: { difficulty: 'ASC' } });
  }

  async findOne(id: string): Promise<Scenario> {
    const scenario = await this.scenarioRepo.findOne({ where: { id } });
    if (!scenario) throw new NotFoundException(`Scenario ${id} not found`);
    return scenario;
  }

  async update(id: string, dto: UpdateScenarioDto): Promise<Scenario> {
    const scenario = await this.findOne(id);
    Object.assign(scenario, dto);
    return this.scenarioRepo.save(scenario);
  }

  async remove(id: string): Promise<void> {
    const scenario = await this.findOne(id);
    await this.scenarioRepo.remove(scenario);
  }

  async incrementPlayCount(id: string): Promise<void> {
    await this.scenarioRepo.increment({ id }, 'timesPlayed', 1);
  }
}
