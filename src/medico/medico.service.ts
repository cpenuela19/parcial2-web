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

  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    if (medico.nombre.length === 0)
      throw new BusinessLogicException(
        'The medic name cannot be empty',
        BusinessError.PRECONDITION_FAILED,
      );
    if (medico.especialidad.length === 0)
      throw new BusinessLogicException(
        'The medic specialty cannot be empty',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.medicoRepository.save(medico);
  }

  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find({
      relations: ['pacientes'],
    });
  }

  async findOne(id: string): Promise<MedicoEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
    if (!medico)
      throw new BusinessLogicException(
        'The medic with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return medico;
  }

  async delete(id: string) {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
    if (!medico)
      throw new BusinessLogicException(
        'The medic with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (medico.pacientes.length >= 1)
      throw new BusinessLogicException(
        'The medic has one or more patients, deletion is not allowed.',
        BusinessError.PRECONDITION_FAILED,
      );
    await this.medicoRepository.remove(medico);
  }
}
