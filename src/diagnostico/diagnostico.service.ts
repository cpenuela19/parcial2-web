import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoRepository.find();
  }

  async findOne(id: string): Promise<DiagnosticoEntity> {
    const diagnostico = await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico)
      throw new BusinessLogicException('El diagnóstico con el id proporcionado no existe.', BusinessError.NOT_FOUND);
    return diagnostico;
  }

  async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    if (diagnostico.descripcion.length > 200)
      throw new BusinessLogicException('La descripción no puede tener más de 200 caracteres.', BusinessError.PRECONDITION_FAILED);

    return await this.diagnosticoRepository.save(diagnostico);
  }

  async delete(id: string): Promise<void> {
    const diagnostico = await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico)
      throw new BusinessLogicException('El diagnóstico con el id proporcionado no existe.', BusinessError.NOT_FOUND);

    await this.diagnosticoRepository.remove(diagnostico);
  }
}
