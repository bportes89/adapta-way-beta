import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RequestWithdrawalDto {
  @ApiProperty({ example: 100, description: 'The amount to withdraw' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'user@example.com', description: 'PIX key for withdrawal' })
  @IsString()
  @IsNotEmpty()
  pixKey: string;
}
