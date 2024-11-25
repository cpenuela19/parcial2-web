import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';
// import { PacienteController } from './paciente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEntity, DiagnosticoEntity])],
  providers: [PacienteService],
  // controllers: [PacienteController],
})
export class PacienteModule {}
