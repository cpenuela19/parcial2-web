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

  it('El servicio DiagnosticoService debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('create debe retornar un nuevo diagnostico', async () => {
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

  it('create debe lanzar una excepcion si la descripcion del diagnostico es invalida', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.words(100),
      pacientes: [],
    };

    await expect(() => service.create(diagnostico)).rejects.toHaveProperty(
      'message',
      'La descripcion del diagnostico es mayor a 200 caracteres.',
    );
  });

  it('findOne debe retornar un diagnostico por id', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticosList[0];
    const diagnostico: DiagnosticoEntity = await service.findOne(
      storedDiagnostico.id,
    );
    expect(diagnostico).not.toBeNull();
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
    expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion);
  });

  it('findOne debe lanzar una excepcion para un diagnostico invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El diagnostico con el id proporcionado no fue encontrado.',
    );
  });

  it('findAll debe retornar todos los diagnosticos', async () => {
    const diagnosticos: DiagnosticoEntity[] = await service.findAll();
    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos).toHaveLength(diagnosticosList.length);
  });

  it('delete debe eliminar un diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    await service.delete(diagnostico.id);
    const deletedDiagnostico: DiagnosticoEntity = await repository.findOne({
      where: { id: diagnostico.id },
    });
    expect(deletedDiagnostico).toBeNull();
  });

  it('delete debe lanzar una excepcion para un diagnostico invalido', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El diagnostico con el id proporcionado no fue encontrado.',
    );
  });
});
