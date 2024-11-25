import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { Repository } from 'typeorm';
import {BusinessError, BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  // Crear un diagnostico
  async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    if (diagnostico.descripcion.length > 200) {
      throw new BusinessLogicException(
        'La descripcion del diagnostico es mayor a 200 caracteres.',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.diagnosticoRepository.save(diagnostico);
  }

  // Obtener todos los diagnosticos
  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoRepository.find({ relations: ['pacientes'] });
  }

  // Obtener un diagnostico por id
  async findOne(id: string): Promise<DiagnosticoEntity> {
    const diagnostico: DiagnosticoEntity =
      await this.diagnosticoRepository.findOne({
        where: { id },
        relations: ['pacientes'],
      });
    if (!diagnostico) {
      throw new BusinessLogicException(
        'El diagnostico con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );
    }

    return diagnostico;
  }

  // Eliminar un diagnostico
  async delete(id: string): Promise<void> {
    const diagnostico: DiagnosticoEntity =
      await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico) {
      throw new BusinessLogicException(
        'El diagnostico con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );
    }

    await this.diagnosticoRepository.remove(diagnostico);
  }
}
