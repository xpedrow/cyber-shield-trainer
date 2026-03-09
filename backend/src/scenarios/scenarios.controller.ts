import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Query, ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ScenariosService } from './scenarios.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('scenarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'scenarios', version: '1' })
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new scenario (admin only)' })
  create(@Body() dto: CreateScenarioDto) {
    return this.scenariosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all scenarios' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  findAll(@Query('activeOnly') activeOnly?: boolean) {
    return this.scenariosService.findAll(activeOnly);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scenario by ID' })
  findOne(@Param('id') id: string) {
    return this.scenariosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update scenario (admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateScenarioDto) {
    return this.scenariosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete scenario (admin only)' })
  remove(@Param('id') id: string) {
    return this.scenariosService.remove(id);
  }
}
