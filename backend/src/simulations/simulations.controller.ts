import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PhishingService } from './phishing.service';
import { PasswordSecurityService } from './password-security.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsNotEmpty, IsEnum, IsObject, IsOptional } from 'class-validator';

class PhishingActionDto {
  @IsString()
  @IsNotEmpty()
  emailId: string;

  @IsEnum(['click', 'report', 'ignore'])
  action: 'click' | 'report' | 'ignore';

  @IsObject()
  @IsOptional()
  metadata?: any;
}

class TestPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

@ApiTags('simulations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'simulations', version: '1' })
export class SimulationsController {
  constructor(
    private readonly phishingService: PhishingService,
    private readonly passwordService: PasswordSecurityService,
  ) {}

  @Get('phishing/emails')
  @ApiOperation({ summary: 'List all phishing email templates' })
  getEmails() {
    return this.phishingService.getTemplates();
  }

  @Post('phishing/action')
  @ApiOperation({ summary: 'Track user action in a phishing email' })
  trackPhishing(@Request() req: any, @Body() dto: PhishingActionDto) {
    return this.phishingService.trackAction(req.user.userId, dto.emailId, dto.action, dto.metadata);
  }

  @Post('password/test')
  @ApiOperation({ summary: 'Analyze password strength and crack time' })
  testPassword(@Body() dto: TestPasswordDto) {
    return this.passwordService.analyze(dto.password);
  }
}
