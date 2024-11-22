import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteMedicoService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
    // Verificar que el paciente existe
    const paciente = await this.pacienteRepository.findOne({ where: { id: pacienteId }, relations: ['medico'] });
    if (!paciente)
      throw new BusinessLogicException('El paciente con el id proporcionado no existe.', BusinessError.NOT_FOUND);
  
    // Verificar que el médico existe
    const medico = await this.medicoRepository.findOne({ where: { id: medicoId }, relations: ['pacientes'] });
    if (!medico)
      throw new BusinessLogicException('El médico con el id proporcionado no existe.', BusinessError.NOT_FOUND);
  
    // Validar que el médico no tenga más de 5 pacientes asignados
    if (medico.pacientes && medico.pacientes.length >= 5)
      throw new BusinessLogicException(
        'El médico no puede tener más de 5 pacientes asignados.',
        BusinessError.PRECONDITION_FAILED,
      );
  
    // Asignar el médico al paciente
    paciente.medico = medico;
  
    // Guardar los cambios en la base de datos
    return await this.pacienteRepository.save(paciente);
  }
  
  
}
