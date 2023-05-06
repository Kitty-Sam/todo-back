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
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
  cookie: string;
}

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({
    status: 200,
    description: 'Return array of all Users and Current User',
  })
  @Get('/users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @ApiOperation({ summary: 'Update User name' })
  @ApiResponse({ status: 200, description: 'Return updated user' })
  @Put('/update-user')
  @UseGuards(JwtAuthGuard)
  async updateUserName(
    @Body() updateUserDto: { newName: string },
    @Req() request: RequestWithUser,
  ): Promise<User> {
    const { user } = request;
    return this.userService.updateUserName(updateUserDto, user);
  }

  @ApiOperation({ summary: 'Remove User' })
  @ApiResponse({ status: 200, description: 'Return void' })
  @Delete('/remove-user')
  @UseGuards(JwtAuthGuard)
  async removeUserByEmail(@Req() request: RequestWithUser): Promise<void> {
    const { user } = request;
    return this.userService.removeUser(user);
  }

  @ApiOperation({ summary: 'Get User by email' })
  @ApiResponse({ status: 200, description: 'Return User' })
  @Post('/get-user-by-email')
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(@Body() getUserDto: { email: string }): Promise<User> {
    return this.userService.getUserByEmail(getUserDto);
  }

  @ApiOperation({ summary: 'Get User by id' })
  @ApiResponse({ status: 200, description: 'Return User' })
  @Post('/get-user-by-id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Body() getUserDto: { id: string }): Promise<User> {
    return this.userService.getUserById(getUserDto);
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

  @ApiOperation({
    summary: 'Get all Deals for proper User without deleted deal',
  })
  @ApiResponse({
    status: 200,
    description: 'Return array of deals for proper User without deleted dea',
  })
  @Delete('/remove-deal')
  @UseGuards(JwtAuthGuard)
  async removeDeal(
    @Body() deleteDealDto: { id: string },
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
    @Body() updateDealDto: { newTitle: string; id: string },
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
    @Body() addFriendDto: { email: string; id: string },
    @Req() request: RequestWithUser,
  ): Promise<string[]> {
    const { user } = request;
    return this.userService.addFriend(addFriendDto, user);
  }

  @ApiOperation({ summary: 'Remove friend' })
  @ApiResponse({
    status: 200,
    description: 'Return array of friends for proper User without deleted User',
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
