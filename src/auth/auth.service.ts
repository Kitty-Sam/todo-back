import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: LoginDto) {
    const user: User = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: RegisterDto) {
    const candidate = await this.userService.getUserByEmail({
      email: userDto.email,
    });
    if (candidate) {
      throw new HttpException(
        'User with such email has already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
      deals: [],
      friends: [],
    });
    // return this.generateToken(user);
    return user;
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, name: user.name };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: LoginDto) {
    const user = await this.userService.getUserByEmail({
      email: userDto.email,
    });
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Incorrect credentials',
    });
  }
}
