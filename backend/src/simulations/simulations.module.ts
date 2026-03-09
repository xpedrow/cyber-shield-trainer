import { Module } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { PasswordSecurityService } from './password-security.service';
import { SocialEngineeringService } from './social-engineering.service';
import { NetworkAttackService } from './network-attack.service';
import { SimulationsController } from './simulations.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [SimulationsController],
  providers: [
    PhishingService, 
    PasswordSecurityService, 
    SocialEngineeringService, 
    NetworkAttackService
  ],
  exports: [
    PhishingService, 
    PasswordSecurityService, 
    SocialEngineeringService, 
    NetworkAttackService
  ],
})
export class SimulationsModule {}
