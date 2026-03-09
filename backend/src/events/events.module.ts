import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { UserAction } from './entities/user-action.entity';
import { AttackEvent } from './entities/attack-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAction, AttackEvent])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
