import { PacienteEntity } from '../paciente/paciente.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('medico')
export class MedicoEntity {
  @Column()
  nombre: string;

  @Column()
  especialidad: string;

  @Column()
  telefono: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => PacienteEntity, (paciente) => paciente.medicos)
  pacientes: PacienteEntity[];
}
