import { IsEnum, IsString, IsOptional, IsBoolean, IsInt, IsObject, IsIP } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttackEventType, EventSeverity } from '../entities/attack-event.entity';

export class CreateAttackEventDto {
  @ApiProperty({ enum: AttackEventType })
  @IsEnum(AttackEventType)
  eventType: AttackEventType;

  @ApiProperty({ enum: EventSeverity })
  @IsEnum(EventSeverity)
  severity: EventSeverity;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsIP()
  sourceIp?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  wasDetected?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  detectionTimeMs?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
