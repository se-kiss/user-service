import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { IUser } from './user.schema';

export class CreateUserArgs
  implements Omit<IUser, '_createdAt' | '_updatedAt'> {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  profileImageId: string;
}

export class UpdateUserArgs
  implements Partial<Omit<IUser, '_createdAt' | '_updatedAt'>> {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  profileImageId?: string;
}

export class GetUsersArgs {
  @IsOptional()
  @IsArray()
  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  ids?: Types.ObjectId[];
}

export class DeleteUserArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
