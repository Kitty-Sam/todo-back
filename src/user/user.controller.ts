import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({ status: 200, description: 'Return array of all Users' })
  @Get('/users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @ApiOperation({ summary: 'Update User name by email' })
  @ApiResponse({ status: 200, description: 'Return updated user' })
  @Put('/user')
  async updateUserAvatarByEmail(
    @Body() updateUserDto: { name: string; email: string },
  ): Promise<User> {
    return this.userService.updateUserName(updateUserDto);
  }

  @ApiOperation({ summary: 'Get User by email' })
  @ApiResponse({ status: 200, description: 'Return void' })
  @Delete('/user')
  async removeUserByEmail(
    @Body() removeUserDto: { email: string },
  ): Promise<void> {
    return this.userService.removeUser(removeUserDto);
  }

  //deals part
  @ApiOperation({ summary: 'Get all Deals for proper User' })
  @ApiResponse({
    status: 200,
    description: 'Return array of deals for proper User',
  })
  @Get('/deals')
  @UseGuards(JwtAuthGuard)
  async getAllDeals(@Req() request: RequestWithUser): Promise<string[]> {
    const { user } = request;
    return this.userService.findAllDeals(user);
  }

  @ApiOperation({ summary: 'Get all Deals for proper User with new one' })
  @ApiResponse({
    status: 200,
    description: 'Return array of deals for proper User with new deal',
  })
  @Post('/create-deal')
  @UseGuards(JwtAuthGuard)
  async createDeal(
    @Body() createDealDto: { title: string },
    @Req() request: RequestWithUser,
  ): Promise<string[]> {
    const { user } = request;
    return this.userService.createDeal(createDealDto, user);
  }

  @ApiOperation({ summary: 'Get all Deals for proper User without new one' })
  @ApiResponse({
    status: 200,
    description: 'Return array of deals for proper User without new deal',
  })
  @Delete('/remove-deal')
  @UseGuards(JwtAuthGuard)
  async removeDeal(
    @Body() deleteDealDto: { title: string },
    @Req() request: RequestWithUser,
  ): Promise<string[]> {
    const { user } = request;
    return this.userService.removeDeal(deleteDealDto, user);
  }

  @ApiOperation({
    summary: 'Get all Deals for proper User with updated new one',
  })
  @ApiResponse({
    status: 200,
    description: 'Return array of deals for proper User with updated new deal',
  })
  @Put('/update-deal')
  @UseGuards(JwtAuthGuard)
  async updateDeal(
    @Body() updateDealDto: { newTitle: string; oldTitle: string },
    @Req() request: RequestWithUser,
  ): Promise<string[]> {
    const { user } = request;
    return this.userService.updateDeal(updateDealDto, user);
  }

  //friends part
  @ApiOperation({ summary: 'Add friend' })
  @ApiResponse({
    status: 200,
    description: 'Return array of friends for proper User',
  })
  @Post('/add-friend')
  @UseGuards(JwtAuthGuard)
  async addFriend(
    @Body() addFriendDto: { email: string },
    @Req() request: RequestWithUser,
  ): Promise<string[]> {
    const { user } = request;
    return this.userService.addFriend(addFriendDto, user);
  }

  @ApiOperation({ summary: 'Add friend' })
  @ApiResponse({
    status: 200,
    description: 'Return array of friends for proper User',
  })
  @Delete('/remove-friend')
  @UseGuards(JwtAuthGuard)
  async removeFriend(
    @Body() removeFriendDto: { email: string },
    @Req() request: RequestWithUser,
  ): Promise<string[]> {
    const { user } = request;
    return this.userService.removeFriend(removeFriendDto, user);
  }

  @ApiOperation({ summary: 'Get all Friends for proper User' })
  @ApiResponse({
    status: 200,
    description: 'Return array of friends for proper User',
  })
  @Get('/friends')
  @UseGuards(JwtAuthGuard)
  async getAllFriends(@Req() request: RequestWithUser): Promise<string[]> {
    const { user } = request;
    return this.userService.findAllFriends(user);
  }
}
