import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('PacienteService - create', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  it('create should successfully create a Paciente', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: faker.name.firstName(),
      genero: 'F',
      medico: null,
      diagnosticos: [],
    };

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({ where: { id: newPaciente.id } });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
  });

  it('create should throw an exception when the nombre is less than 3 characters', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: 'Jo', 
      genero: 'M',
      medico: null,
      diagnosticos: [],
    };

    await expect(service.create(paciente)).rejects.toThrowError(
      new BusinessLogicException(
        'El nombre del paciente debe tener al menos 3 caracteres.',
        400, 
      ),
    );
  });
});
