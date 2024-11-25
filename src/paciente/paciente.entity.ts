import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';
import { MedicoEntity } from '../medico/medico.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('paciente')
export class PacienteEntity {
  @Column()
  nombre: string;

  @Column()
  genero: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => MedicoEntity, (medico) => medico.pacientes)
  @JoinTable()
  medicos: MedicoEntity[];

  @ManyToMany(() => DiagnosticoEntity, (diagnostico) => diagnostico.pacientes)
  @JoinTable()
  diagnosticos: DiagnosticoEntity[];
}
