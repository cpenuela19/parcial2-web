/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from '../../diagnostico/diagnostico.entity';
import { MedicoEntity } from '../../medico/medico.entity';
import { PacienteEntity } from '../../paciente/paciente.entity';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [MedicoEntity, DiagnosticoEntity, PacienteEntity],
        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([MedicoEntity, DiagnosticoEntity, PacienteEntity]),
];
