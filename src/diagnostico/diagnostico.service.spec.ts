import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticosList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(
      getRepositoryToken(DiagnosticoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    diagnosticosList = [];

    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await repository.save({
        nombre: faker.lorem.words(),
        descripcion: faker.lorem.words(10),
      });
      diagnosticosList.push(diagnostico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new diagnosis', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.words(10),
      pacientes: [],
    };

    const newDiagnostico: DiagnosticoEntity = await service.create(diagnostico);
    expect(newDiagnostico).not.toBeNull();

    const storedDiagnostico: DiagnosticoEntity = await repository.findOne({
      where: { id: newDiagnostico.id },
    });
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.nombre).toEqual(newDiagnostico.nombre);
    expect(storedDiagnostico.descripcion).toEqual(newDiagnostico.descripcion);
  });

  it('create should throw an exception for an invalid diagnosis description', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.words(100),
      pacientes: [],
    };

    await expect(() => service.create(diagnostico)).rejects.toHaveProperty(
      'message',
      'The diagnosis description is longer than 200 characters.',
    );
  });

  it('findOne should return a diagnosis by id', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticosList[0];
    const diagnostico: DiagnosticoEntity = await service.findOne(
      storedDiagnostico.id,
    );
    expect(diagnostico).not.toBeNull();
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
    expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion);
  });

  it('findOne should throw an exception for an invalid diagnosis', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The diagnosis with the given id was not found',
    );
  });

  it('findAll should return all diagnosis', async () => {
    const diagnosticos: DiagnosticoEntity[] = await service.findAll();
    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos).toHaveLength(diagnosticosList.length);
  });

  it('delete should remove a diagnosis', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    await service.delete(diagnostico.id);
    const deletedDiagnostico: DiagnosticoEntity = await repository.findOne({
      where: { id: diagnostico.id },
    });
    expect(deletedDiagnostico).toBeNull();
  });

  it('delete should throw an exception for an invalid diagnosis', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The diagnosis with the given id was not found',
    );
  });
});
