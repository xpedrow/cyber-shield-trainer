import { IsEnum, IsUUID, IsOptional, IsBoolean, IsInt, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionType, ActionRisk } from '../entities/user-action.entity';

export class CreateUserActionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  scenarioId?: string;

  @ApiProperty({ enum: ActionType })
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty({ enum: ActionRisk })
  @IsEnum(ActionRisk)
  @IsOptional()
  risk?: ActionRisk;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  pointsDelta?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  responseTimeMs?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
