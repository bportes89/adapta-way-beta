import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Johnny',
    description: 'The social name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  socialName?: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'The photo URL of the user',
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({
    example: 'user',
    description: 'The role of the user',
    required: false,
    enum: ['user', 'admin', 'company'],
  })
  @IsString()
  @IsOptional()
  role?: string;
}
