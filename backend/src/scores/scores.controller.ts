import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('scores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'scores', version: '1' })
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new score for a scenario' })
  submit(@Request() req: any, @Body() dto: CreateScoreDto) {
    return this.scoresService.submitScore(req.user.userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all my scores' })
  findAllMyScores(@Request() req: any) {
    return this.scoresService.findByUser(req.user.userId);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get my global performance stats' })
  getMyStats(@Request() req: any) {
    return this.scoresService.getGlobalStats(req.user.userId);
  }

  @Get('best/:scenarioId')
  @ApiOperation({ summary: 'Get my best score for a specific scenario' })
  getBest(@Request() req: any, @Param('scenarioId') scenarioId: string) {
    return this.scoresService.getBestByScenario(req.user.userId, scenarioId);
  }
}
