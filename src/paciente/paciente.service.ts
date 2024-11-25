import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { Repository } from 'typeorm';
import {BusinessError, BusinessLogicException,} from '../shared/errors/business-errors';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (paciente.nombre.length < 3)
      throw new BusinessLogicException(
        'The patient name is shorter than 3 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.pacienteRepository.save(paciente);
  }

  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({
      relations: ['diagnosticos', 'medicos'],
    });
  }

  async findOne(id: string): Promise<PacienteEntity> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos', 'medicos'],
    });
    if (!paciente)
      throw new BusinessLogicException(
        'The patient with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return paciente;
  }

  async delete(id: string) {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos'],
    });
    if (!paciente)
      throw new BusinessLogicException(
        'The patient with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (paciente.diagnosticos.length >= 1)
      throw new BusinessLogicException(
        'The patient has one or more diagnostics, deletion is not allowed.',
        BusinessError.PRECONDITION_FAILED,
      );

    await this.pacienteRepository.remove(paciente);
  }
}
