import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { AssetType } from '../entities/asset.entity';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(AssetType)
  type: AssetType;

  @IsNumber()
  totalSupply: number;

  @IsNumber()
  referenceValue: number;
}
