import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({
    example: 'blocked',
    description: 'The new status of the user',
    enum: ['active', 'blocked'],
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['active', 'blocked'])
  status: string;
}
