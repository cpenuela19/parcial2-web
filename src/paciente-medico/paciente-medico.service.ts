import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import {BusinessError, BusinessLogicException,
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

  // Asociar un medico a un paciente
  async addMedicoToPaciente(
    pacienteId: string,
    medicoId: string,
  ): Promise<PacienteEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id: medicoId },
    });
    if (!medico) {
      throw new BusinessLogicException(
        'El medico con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );
    }

    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos', 'diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );
    }

    if (paciente.medicos.length >= 5) {
      throw new BusinessLogicException(
        'El paciente ya tiene asignados 5 medicos.',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    paciente.medicos = [...paciente.medicos, medico];
    return await this.pacienteRepository.save(paciente);
  }
}
