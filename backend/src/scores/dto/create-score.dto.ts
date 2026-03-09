import { IsUUID, IsInt, Min, Max, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScoreDto {
  @ApiProperty()
  @IsUUID()
  scenarioId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  score: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  hintsUsed?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  completionTimeSeconds?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  breakdown?: {
    phishingDetection?: number;
    responseTime?: number;
    correctActions?: number;
    bonusPoints?: number;
  };
}
