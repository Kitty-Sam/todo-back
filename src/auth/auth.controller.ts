import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Return token of logged User' })
  @Post('/login')
  login(@Body() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 200, description: 'Return token of registered User' })
  @Post('/register')
  registration(@Body() userDto: RegisterDto) {
    return this.authService.registration(userDto);
  }
}
