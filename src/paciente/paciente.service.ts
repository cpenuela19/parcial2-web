import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({ relations: ['medico', 'diagnosticos'] });
  }

  async findOne(id: string): Promise<PacienteEntity> {
    const paciente = await this.pacienteRepository.findOne({ where: { id }, relations: ['medico', 'diagnosticos'] });
    if (!paciente)
      throw new BusinessLogicException('El paciente con el id proporcionado no existe.', BusinessError.NOT_FOUND);
    return paciente;
  }

  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (paciente.nombre.length < 3)
      throw new BusinessLogicException('El nombre del paciente debe tener al menos 3 caracteres.', BusinessError.PRECONDITION_FAILED);

    return await this.pacienteRepository.save(paciente);
  }

  async delete(id: string): Promise<void> {
    const paciente = await this.pacienteRepository.findOne({ where: { id }, relations: ['diagnosticos'] });
    if (!paciente)
      throw new BusinessLogicException('El paciente con el id proporcionado no existe.', BusinessError.NOT_FOUND);
    if (paciente.diagnosticos.length > 0)
      throw new BusinessLogicException('No se puede eliminar un paciente con diagnósticos asociados.', BusinessError.PRECONDITION_FAILED);

    await this.pacienteRepository.remove(paciente);
  }
}
