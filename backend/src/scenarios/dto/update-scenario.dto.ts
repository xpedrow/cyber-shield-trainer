import { PartialType } from '@nestjs/swagger';
import { CreateScenarioDto } from './create-scenario.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateScenarioDto extends PartialType(CreateScenarioDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
