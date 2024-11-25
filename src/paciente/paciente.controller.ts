import {Body,Controller,Delete,Get,HttpCode,Param,Post,UseInterceptors,} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PacienteDto } from './paciente.dto';
import { PacienteEntity } from './paciente.entity';
import { plainToInstance } from 'class-transformer';
  
@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) {}
  
    @Get()
    async findAll() {
      return await this.pacienteService.findAll();
    }
  
    @Get(':pacienteId')
    async findOne(@Param('pacienteId') pacienteId: string) {
      return await this.pacienteService.findOne(pacienteId);
    }
  
    @Post()
    async create(@Body() pacienteDto: PacienteDto) {
      const paciente: PacienteEntity = plainToInstance(
        PacienteEntity,
        pacienteDto,
      );
      return await this.pacienteService.create(paciente);
    }
  
    @Delete(':pacienteId')
    @HttpCode(204)
    async delete(@Param('pacienteId') pacienteId: string) {
      return await this.pacienteService.delete(pacienteId);
    }
  }
  