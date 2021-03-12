import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { CreateUserArgs, GetUsersArgs, UpdateUserArgs } from './user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async onModuleInit() {
    await this.userModel.syncIndexes();
  }

  async createUser(user: CreateUserArgs): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async getUsers({ ids }: GetUsersArgs): Promise<User[]> {
    const user = this.userModel.find({});
    ids && user.find({ _id: { $in: ids } });
    return await user.exec();
  }

  async updateUser(user: UpdateUserArgs): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(user._id, {
      ...user,
      _updatedAt: new Date(),
    });
    if (!updatedUser) throw new NotFoundException();
    return await this.userModel.findById(updatedUser._id).exec();
  }

  async deleteUser(_id: Types.ObjectId): Promise<User> {
    return await this.userModel.findByIdAndDelete(_id).exec();
  }
}
