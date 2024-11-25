import { IsNotEmpty, IsString } from 'class-validator';

export class MedicoDto {
  @IsString()
  readonly nombre: string;

  @IsString()
  readonly especialidad: string;

  @IsString()
  @IsNotEmpty()
  readonly telefono: string;
}
