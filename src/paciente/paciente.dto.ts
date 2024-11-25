import { IsNotEmpty, IsString } from 'class-validator';

export class PacienteDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly genero: string;
}
