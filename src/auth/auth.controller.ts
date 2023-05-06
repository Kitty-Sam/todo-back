import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Return token of logged User' })
  @Post('/login')
  async login(@Body() userDto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(userDto, res);
    return res.send({ message: 'cookie set', token });
  }

  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 200, description: 'Return registered User' })
  @Post('/register')
  registration(@Body() userDto: RegisterDto) {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'Check Auth' })
  @ApiResponse({ status: 200, description: 'Return Auth User' })
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Req() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Logout User' })
  @ApiResponse({ status: 200, description: '' })
  @Get('/logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
