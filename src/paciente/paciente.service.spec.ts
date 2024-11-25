import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let diagnosticoRepository: Repository<DiagnosticoEntity>;
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(
      getRepositoryToken(DiagnosticoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.person.fullName(),
        genero: faker.person.gender(),
      });
      pacientesList.push(paciente);
    }
  };

  it('El servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('create debe retornar un nuevo paciente', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
      medicos: [],
      diagnosticos: [],
    };

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({
      where: { id: newPaciente.id },
    });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
  });

  it('create debe lanzar una excepcion si el nombre del paciente tiene menos de 3 caracteres', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: 'AB',
      genero: faker.person.gender(),
      medicos: [],
      diagnosticos: [],
    };

    await expect(service.create(paciente)).rejects.toHaveProperty(
      'message',
      'El nombre del paciente es menor a 3 caracteres.',
    );
  });

  it('findOne debe retornar un paciente por id', async () => {
    const storedPaciente: PacienteEntity = pacientesList[0];
    const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
    expect(paciente).not.toBeNull();
    expect(paciente.nombre).toEqual(storedPaciente.nombre);
    expect(paciente.genero).toEqual(storedPaciente.genero);
  });

  it('findOne debe lanzar una excepcion si el paciente no existe', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El paciente con el id proporcionado no fue encontrado.',
    );
  });

  it('findAll debe retornar todos los pacientes', async () => {
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toHaveLength(pacientesList.length);
  });

  it('delete debe eliminar un paciente', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    await service.delete(paciente.id);

    const deletedPaciente: PacienteEntity = await repository.findOne({
      where: { id: paciente.id },
    });
    expect(deletedPaciente).toBeNull();
  });

  it('delete debe lanzar una excepcion si el paciente no existe', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El paciente con el id proporcionado no fue encontrado.',
    );
  });

  it('delete debe lanzar una excepcion si el paciente tiene uno o mas diagnosticos', async () => {
    const diagnostico: DiagnosticoEntity = await diagnosticoRepository.save({
      nombre: faker.person.fullName(),
      descripcion: faker.lorem.sentence(),
    });

    const paciente: PacienteEntity = await repository.save({
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
      diagnosticos: [diagnostico],
    });

    await expect(() => service.delete(paciente.id)).rejects.toHaveProperty(
      'message',
      'El paciente tiene uno o mas diagnosticos, la eliminacion no esta permitida.',
    );
  });
});
