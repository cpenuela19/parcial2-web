import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(
      getRepositoryToken(MedicoEntity),
    );
    pacienteRepository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    await pacienteRepository.clear();
    medicosList = [];

    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await repository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.person.jobTitle(),
        telefono: faker.phone.number(),
      });
      medicosList.push(medico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new medic', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: faker.person.fullName(),
      especialidad: faker.person.jobTitle(),
      telefono: faker.phone.number(),
      pacientes: [],
    };

    const newMedico: MedicoEntity = await service.create(medico);
    expect(newMedico).not.toBeNull();

    const storedMedico: MedicoEntity = await repository.findOne({
      where: { id: newMedico.id },
    });
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(newMedico.nombre);
    expect(storedMedico.especialidad).toEqual(newMedico.especialidad);
    expect(storedMedico.telefono).toEqual(newMedico.telefono);
  });

  it('create should throw an exception for an invalid medic name', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: '',
      especialidad: faker.person.jobTitle(),
      telefono: faker.phone.number(),
      pacientes: [],
    };

    await expect(() => service.create(medico)).rejects.toHaveProperty(
      'message',
      'The medic name cannot be empty',
    );
  });

  it('create should throw an exception for an invalid doctor speciality', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: faker.person.fullName(),
      especialidad: '',
      telefono: faker.phone.number(),
      pacientes: [],
    };
    await expect(() => service.create(medico)).rejects.toHaveProperty(
      'message',
      'The medic specialty cannot be empty',
    );
  });

  it('findOne should return a medic by id', async () => {
    const storedMedico: MedicoEntity = medicosList[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    expect(medico).not.toBeNull();
    expect(medico.nombre).toEqual(storedMedico.nombre);
    expect(medico.especialidad).toEqual(storedMedico.especialidad);
    expect(medico.telefono).toEqual(storedMedico.telefono);
  });

  it('findOne should throw an exception for an invalid medic', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The medic with the given id was not found',
    );
  });

  it('findAll should return all medics', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos).toHaveLength(medicosList.length);
  });

  it('delete should remove a medic', async () => {
    const medico: MedicoEntity = medicosList[0];
    await service.delete(medico.id);

    const deletedMedico: MedicoEntity = await repository.findOne({
      where: { id: medico.id },
    });
    expect(deletedMedico).toBeNull();
  });

  it('delete should throw an exception for an invalid medic', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The medic with the given id was not found',
    );
  });

  it('delete should throw an exception if the medic has one or more patients', async () => {
    const paciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
    });

    const medico: MedicoEntity = await repository.save({
      nombre: faker.company.name(),
      especialidad: faker.person.jobTitle(),
      telefono: faker.phone.number(),
      pacientes: [paciente],
    });

    await expect(() => service.delete(medico.id)).rejects.toHaveProperty(
      'message',
      'The medic has one or more patients, deletion is not allowed.',
    );
  });
});
