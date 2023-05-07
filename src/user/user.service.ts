import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>, // @InjectConnection() private connection: Connection,
  ) {}

  async createUser(createUserDto: RegisterDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUserByEmail(getUserDto: { email: string }): Promise<User> {
    const user = await this.userModel.findOne({ email: getUserDto.email });
    return user;
  }

  async getUserById(getUserDto: { id: string }): Promise<User> {
    const user = await this.userModel.findOne({ _id: getUserDto.id });
    return user;
  }

  async updateUserName(
    updateDto: {
      newName: string;
    },
    user: User,
  ): Promise<User> {
    const { newName } = updateDto;
    const { email } = user;
    try {
      await this.userModel.updateOne(
        { email: email },
        { $set: { name: newName } },
      );
    } catch (e) {
      console.log(e);
    }
    const currentUser = await this.userModel.findOne({ email });
    return currentUser;
  }

  async removeUser(user: User): Promise<void> {
    const { email } = user;
    await this.userModel.deleteOne({ email });
  }

  //deal part

  async findAllDeals(user: User): Promise<string[]> {
    const { email } = user;
    const currentUser = await this.userModel.findOne({ email });
    return currentUser.deals;
  }

  async createDeal(
    createDealDto: { title: string },
    user: User,
  ): Promise<string[]> {
    const { email } = user;
    const id = new mongoose.Types.ObjectId();

    try {
      await this.userModel.updateOne(
        { email: email },
        { $push: { deals: { title: createDealDto.title, id } } },
      );
    } catch (e) {
      console.log(e);
    }

    const currentUser = await this.userModel.findOne({ email });
    return currentUser.deals;
  }

  async removeDeal(
    deleteDealDto: { id: string },
    user: User,
  ): Promise<string[]> {
    const { email } = user;
    const currentId = new mongoose.Types.ObjectId(deleteDealDto.id);

    try {
      await this.userModel.updateOne(
        { email: email },
        { $pull: { deals: { id: currentId } } },
      );
    } catch (e) {
      console.log(e);
    }

    const currentUser = await this.userModel.findOne({ email });
    return currentUser.deals;
  }

  async updateDeal(
    updateDealDto: { newTitle: string; id: string },
    user: User,
  ): Promise<string[]> {
    const { email } = user;

    const currentId = new mongoose.Types.ObjectId(updateDealDto.id);

    try {
      const res = await this.userModel.updateOne(
        { email: email, deals: { $elemMatch: { id: currentId } } },
        {
          $set: { 'deals.$': { title: updateDealDto.newTitle, id: currentId } },
        },
      );

      if (!res.acknowledged) {
        console.log('input all data');
      }
    } catch (e) {
      console.log(e);
    }

    const currentUser = await this.userModel.findOne({ email });
    return currentUser.deals;
  }

  //friends
  async addFriend(
    addFriendDto: { email: string; id: string },
    user: User,
  ): Promise<string[]> {
    const { email } = user;

    try {
      await this.userModel.updateOne(
        { email: email },
        {
          $push: {
            friends: { email: addFriendDto.email, id: addFriendDto.id },
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
    const currentUser = await this.userModel.findOne({ email });
    return currentUser.friends;
  }

  async removeFriend(
    removeFriendDto: { id: string },
    user: User,
  ): Promise<string[]> {
    const { email } = user;

    try {
      await this.userModel.updateOne(
        { email: email },
        { $pull: { friends: { id: removeFriendDto.id } } },
      );
    } catch (e) {
      console.log(e);
    }
    const currentUser = await this.userModel.findOne({ email });
    return currentUser.friends;
  }

  async findAllFriends(user: User): Promise<string[]> {
    const { email } = user;
    const currentUser = await this.userModel.findOne({ email });
    return currentUser.friends;
  }
}
