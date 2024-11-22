import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
  } from "typeorm";
  import { MedicoEntity } from "../medico/medico.entity";
  import { DiagnosticoEntity } from "../diagnostico/diagnostico.entity";
  
  @Entity()
  export class PacienteEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    nombre: string;
  
    @Column()
    genero: string;
  
    @ManyToOne(() => MedicoEntity, (medico) => medico.pacientes)
    medico: MedicoEntity;
  
    @ManyToMany(() => DiagnosticoEntity, (diagnostico) => diagnostico.pacientes)
    @JoinTable()
    diagnosticos: DiagnosticoEntity[];
  }
  