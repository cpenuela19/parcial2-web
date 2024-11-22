import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from "typeorm";
  import { PacienteEntity } from "../paciente/paciente.entity";
  
  @Entity() 
  export class MedicoEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    nombre: string;
  
    @Column()
    especialidad: string;
  
    @Column()
    telefono: string;
  
    @OneToMany(() => PacienteEntity, (paciente) => paciente.medico, { cascade: true })
    pacientes: PacienteEntity[];
  }
  