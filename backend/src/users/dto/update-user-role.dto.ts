import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: 'admin',
    description: 'The new role of the user',
    enum: ['user', 'admin', 'company'],
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['user', 'admin', 'company'])
  role: string;
}
