import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { status } from 'grpc';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('UserService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:5000',
        package: 'user',
        protoPath: 'user.proto',
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: errors =>
        new RpcException({
          code: status.INVALID_ARGUMENT,
          message: errors.toString(),
        }),
    }),
  );
  app.listen(() => logger.log('User service is listening'));
}
bootstrap();
