import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { Repository } from 'typeorm';
import {BusinessError, BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  // Crear un paciente
  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (paciente.nombre.length < 3) {
      throw new BusinessLogicException(
        'El nombre del paciente es menor a 3 caracteres.',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.pacienteRepository.save(paciente);
  }

  // Obtener todos los pacientes
  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({
      relations: ['diagnosticos', 'medicos'],
    });
  }

  // Obtener un paciente por ID
  async findOne(id: string): Promise<PacienteEntity> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos', 'medicos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );
    }
    return paciente;
  }

  // Eliminar un paciente
  async delete(id: string): Promise<void> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );
    }

    if (paciente.diagnosticos.length >= 1) {
      throw new BusinessLogicException(
        'El paciente tiene uno o mas diagnosticos, la eliminacion no esta permitida.',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    await this.pacienteRepository.remove(paciente);
  }
}
