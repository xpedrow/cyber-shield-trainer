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
