import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';

@Module({
  providers: [MedicoService]
})
export class MedicoModule {}
