import { NestFactory } from '@nestjs/core';
import { ConsoleLogger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ValidationPipeCustom,
  LoggerCustom,
  AbstractLogRepository,
} from '@/custom';
import { ENVIRONMENT, PORT } from '@/shared';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  console.log(ENVIRONMENT);

  ENVIRONMENT == 'TEST'
    ? SwaggerModule.setup(
        'api/docs',
        app,
        SwaggerModule.createDocument(
          app,
          new DocumentBuilder()
            .setTitle('Api de Despesas')
            .setDescription('Aplicação voltada para gerenciamento de despesas')
            .setVersion('1.0.0')
            .build(),
        ),
      )
    : null;

  app.useLogger(
    new LoggerCustom(
      new ConsoleLogger(),
      app.get<AbstractLogRepository>(AbstractLogRepository),
    ),
  );

  app.useGlobalPipes(new ValidationPipeCustom());

  await app.listen(PORT || 3000);
}
bootstrap();
