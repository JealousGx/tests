import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLeaseDto {
  @IsNumber()
  @IsNotEmpty()
  unitId: number;

  @IsNumber()
  @IsNotEmpty()
  tenantId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  monthlyRent: number;

  @IsNumber()
  @IsOptional()
  securityDeposit?: number;
}
