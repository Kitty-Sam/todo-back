import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email. Should be unique',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'strong password',
    description: 'Password. Min length 4 symbols',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  readonly password: string;

  @ApiProperty({ example: 'example', description: 'Name' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: '["do smth", "buy smth"]',
    description: 'List of good things. By default is []',
  })
  readonly deals: string[];
  readonly friends: string[];
}

export class LoginDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email. Should be unique',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'strong password',
    description: 'Password. Min length 4 symbols',
  })
  @MinLength(4)
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
