import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { Repository } from 'typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker/.';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let medicoRepository: Repository<MedicoEntity>;
  let pacienteRepository: Repository<PacienteEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    medicoRepository = module.get<Repository<MedicoEntity>>(
      getRepositoryToken(MedicoEntity),
    );
    pacienteRepository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await medicoRepository.clear();
    await pacienteRepository.clear();
    medicosList = [];

    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.person.jobTitle(),
        telefono: faker.phone.number(),
      });
      medicosList.push(medico);
    }

    paciente = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
      medicos: medicosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should add a medic to a patient', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.fullName(),
      especialidad: faker.person.jobTitle(),
      telefono: faker.phone.number(),
    });

    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
    });

    const result: PacienteEntity = await service.addMedicoToPaciente(
      newPaciente.id,
      newMedico.id,
    );

    expect(result.medicos.length).toBe(1);
    expect(result.medicos[0]).not.toBeNull();
    expect(result.medicos[0].nombre).toBe(newMedico.nombre);
    expect(result.medicos[0].especialidad).toBe(newMedico.especialidad);
    expect(result.medicos[0].telefono).toBe(newMedico.telefono);
  });

  it('addMedicoToPaciente should thrown exception for an invalid medic', async () => {
    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
    });

    await expect(() =>
      service.addMedicoToPaciente(newPaciente.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The medic with the given id was not found',
    );
  });

  it('addMedicoToPaciente should throw an exception for an invalid patient', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.fullName(),
      especialidad: faker.person.jobTitle(),
      telefono: faker.phone.number(),
    });

    await expect(() =>
      service.addMedicoToPaciente('0', newMedico.id),
    ).rejects.toHaveProperty(
      'message',
      'The patient with the given id was not found',
    );
  });

  it('addMedicoToPaciente should throw an exception when a patient already has 5 assigned doctors', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.fullName(),
      especialidad: faker.person.jobTitle(),
      telefono: faker.phone.number(),
    });

    await expect(() =>
      service.addMedicoToPaciente(paciente.id, newMedico.id),
    ).rejects.toHaveProperty(
      'message',
      'The patient already has 5 assigned medics',
    );
  });
});
