import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from 'grpc';
import { UserService } from './user.service';
import {
  CreateUserArgs,
  GetUsersArgs,
  UpdateUserArgs,
  DeleteUserArgs,
} from './user.dto';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(args: CreateUserArgs): Promise<User> {
    try {
      return await this.userService.createUser(args);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('UserService', 'GetUsers')
  async getUsers(args: GetUsersArgs): Promise<{ users: User[] }> {
    try {
      return { users: await this.userService.getUsers(args) };
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(args: UpdateUserArgs): Promise<User> {
    try {
      return await this.userService.updateUser(args);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: args._id.toHexString(),
        });
      } else {
        throw new RpcException({
          code: status.INTERNAL,
          message: e.message,
        });
      }
    }
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser(args: DeleteUserArgs): Promise<User> {
    try {
      return await this.userService.deleteUser(args._id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: args._id.toHexString(),
        });
      } else {
        throw new RpcException({
          code: status.INTERNAL,
          message: e.message,
        });
      }
    }
  }
}
