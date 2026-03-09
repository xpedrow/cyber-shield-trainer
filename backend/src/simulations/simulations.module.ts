import { Module } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { PasswordSecurityService } from './password-security.service';
import { SimulationsController } from './simulations.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [SimulationsController],
  providers: [PhishingService, PasswordSecurityService],
  exports: [PhishingService, PasswordSecurityService],
})
export class SimulationsModule {}
