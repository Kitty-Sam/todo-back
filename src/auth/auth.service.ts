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
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: LoginDto, res: Response) {
    const user: User = await this.validateUser(userDto);
    return this.generateTokenAndSetIntoCookie(user, res);
  }

  private async generateTokenAndSetIntoCookie(user: User, res: Response) {
    const payload = { email: user.email, name: user.name };
    const token = this.jwtService.sign(payload);

    const TIME = 60 * 60 * 1000;
    const expires = new Date(Date.now() + TIME);

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: false,
      secure: false,
      expires,
    });

    return token;
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
    return user;
  }

  async logout(res: Response) {
    res.clearCookie('jwt', { path: '/', domain: 'localhost' });
    return res.send({ message: 'clear cookie' });
  }
}
