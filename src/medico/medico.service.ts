import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find({ relations: ['pacientes'] });
  }

  async findOne(id: string): Promise<MedicoEntity> {
    const medico = await this.medicoRepository.findOne({ where: { id }, relations: ['pacientes'] });
    if (!medico)
      throw new BusinessLogicException('El médico con el id proporcionado no existe.', BusinessError.NOT_FOUND);
    return medico;
  }

  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    if (!medico.nombre || !medico.especialidad)
      throw new BusinessLogicException('El nombre y la especialidad son obligatorios.', BusinessError.PRECONDITION_FAILED);

    return await this.medicoRepository.save(medico);
  }

  async delete(id: string): Promise<void> {
    const medico = await this.medicoRepository.findOne({ where: { id }, relations: ['pacientes'] });
    if (!medico)
      throw new BusinessLogicException('El médico con el id proporcionado no existe.', BusinessError.NOT_FOUND);
    if (medico.pacientes.length > 0)
      throw new BusinessLogicException('No se puede eliminar un médico que tiene pacientes asignados.', BusinessError.PRECONDITION_FAILED);

    await this.medicoRepository.remove(medico);
  }
}
