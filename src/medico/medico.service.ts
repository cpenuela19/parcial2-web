import { Injectable } from '@nestjs/common';
import { MedicoEntity } from './medico.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {BusinessError, BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  // Crear un medico
  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    if (medico.nombre.length === 0) {
      throw new BusinessLogicException(
        'El nombre del medico no puede estar vacio.',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    if (medico.especialidad.length === 0) {
      throw new BusinessLogicException(
        'La especialidad del medico no puede estar vacia.',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.medicoRepository.save(medico);
  }

  // Obtener todos los medicos
  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find({
      relations: ['pacientes'],
    });
  }

  // Obtener un medico por ID
  async findOne(id: string): Promise<MedicoEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
    if (!medico) {
      throw new BusinessLogicException(
        'El medico con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );
    }

    return medico;
  }

  // Eliminar un medico
  async delete(id: string): Promise<void> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
    if (!medico) {
      throw new BusinessLogicException(
        'El medico con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );
    }

    if (medico.pacientes.length >= 1) {
      throw new BusinessLogicException(
        'El medico tiene uno o mas pacientes, la eliminacion no esta permitida.',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    await this.medicoRepository.remove(medico);
  }
}
