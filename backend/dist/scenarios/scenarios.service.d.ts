import { Repository } from 'typeorm';
import { Scenario } from './entities/scenario.entity';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
export declare class ScenariosService {
    private readonly scenarioRepo;
    constructor(scenarioRepo: Repository<Scenario>);
    create(dto: CreateScenarioDto): Promise<Scenario>;
    findAll(isActive?: boolean): Promise<Scenario[]>;
    findOne(id: string): Promise<Scenario>;
    update(id: string, dto: UpdateScenarioDto): Promise<Scenario>;
    remove(id: string): Promise<void>;
    incrementPlayCount(id: string): Promise<void>;
}
