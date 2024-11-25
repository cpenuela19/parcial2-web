import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class PacienteMedicoService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,

    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async addMedicoToPaciente(
    pacienteId: string,
    medicoId: string,
  ): Promise<PacienteEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id: medicoId },
    });
    if (!medico) {
      throw new BusinessLogicException(
        'The medic with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos', 'diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'The patient with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (paciente.medicos.length >= 5) {
      throw new BusinessLogicException(
        'The patient already has 5 assigned medics',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    paciente.medicos = [...paciente.medicos, medico];
    return await this.pacienteRepository.save(paciente);
  }
}
