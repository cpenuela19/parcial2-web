import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoController } from './medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity, PacienteEntity])],
  providers: [MedicoService],
  controllers: [MedicoController],
})
export class MedicoModule {}
