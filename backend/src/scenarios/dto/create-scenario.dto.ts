import { IsString, IsEnum, IsInt, IsOptional, IsArray, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScenarioType, ScenarioDifficulty } from '../entities/scenario.entity';

export class CreateScenarioDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ScenarioType })
  @IsEnum(ScenarioType)
  type: ScenarioType;

  @ApiProperty({ enum: ScenarioDifficulty })
  @IsEnum(ScenarioDifficulty)
  difficulty: ScenarioDifficulty;

  @ApiProperty()
  @IsInt()
  maxScore: number;

  @ApiProperty()
  @IsInt()
  xpReward: number;

  @ApiProperty()
  @IsInt()
  durationSeconds: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
