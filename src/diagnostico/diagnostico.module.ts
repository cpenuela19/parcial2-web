import { Module } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';

@Module({
  providers: [DiagnosticoService]
})
export class DiagnosticoModule {}
