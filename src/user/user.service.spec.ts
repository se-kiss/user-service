import { Model, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { UpdateUserArgs } from './user.dto';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;
  let mongoose: Model<User>;

  beforeAll(async () => {
    @Module({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URL),
      ],
    })
    class RootModule {}

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        RootModule,
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    mongoose = module.get<Model<User>>(getModelToken(User.name));

    await mongoose.deleteMany({});
    await mongoose.syncIndexes();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mongoose).toBeDefined();
  });

  it('should create user', async () => {
    const res = await service.createUser({
      firstName: 'test',
      lastName: 'test',
    });
    expect(await mongoose.findById(res._id)).toBeDefined();
  });

  it('should get users', async () => {
    const user = await service.createUser({
      firstName: 'test2',
      lastName: 'test2',
    });
    const res = await service.getUsers({ ids: [user._id] });
    expect(res[0]._id).toEqual(user._id);
    expect(res[0].firstName).toEqual(user.firstName);
    expect(res[0].lastName).toEqual(user.lastName);
  });

  it('should not get non-exest user', async () => {
    expect(
      await service.getUsers({ ids: [new Types.ObjectId()] }),
    ).toHaveLength(0);
  });

  it('should update user', async () => {
    const user = await service.createUser({
      firstName: 'test3',
      lastName: 'test3',
    });
    const args: UpdateUserArgs = {
      _id: user._id,
      firstName: 'testtest',
    };
    await service.updateUser(args);
    const newUser = await mongoose.findById(user._id);
    expect(newUser.firstName).toEqual(args.firstName);
  });

  it('should delete user', async () => {
    const user = await service.createUser({
      firstName: 'test4',
      lastName: 'test4',
    });
    await service.deleteUser(user._id);
    expect(await service.getUsers({ ids: [user._id] })).toHaveLength(0);
  });
});
