import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUnitDto {
  @IsEnum(['APARTMENT', 'HOUSE', 'COMMERCIAL'])
  type: 'APARTMENT' | 'HOUSE' | 'COMMERCIAL';

  @IsNumber()
  @IsNotEmpty()
  ownerId: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsEnum(['VACANT', 'OCCUPIED'])
  @IsOptional()
  status?: 'VACANT' | 'OCCUPIED' = 'VACANT';
}
