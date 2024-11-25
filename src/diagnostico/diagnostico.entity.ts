import { PacienteEntity } from '../paciente/paciente.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('diagnostico')
export class DiagnosticoEntity {
  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => PacienteEntity, (paciente) => paciente.diagnosticos)
  pacientes: PacienteEntity[];
}
