import { ScenariosService } from './scenarios.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
export declare class ScenariosController {
    private readonly scenariosService;
    constructor(scenariosService: ScenariosService);
    create(dto: CreateScenarioDto): Promise<import("./entities/scenario.entity").Scenario>;
    findAll(activeOnly?: boolean): Promise<import("./entities/scenario.entity").Scenario[]>;
    findOne(id: string): Promise<import("./entities/scenario.entity").Scenario>;
    update(id: string, dto: UpdateScenarioDto): Promise<import("./entities/scenario.entity").Scenario>;
    remove(id: string): Promise<void>;
}
