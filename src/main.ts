import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const options = {
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: [
    'origin',
    'x-requested-with',
    'content-type',
    'accept',
    'authorization',
  ],
  exposedHeaders: ['Set-Cookie'],
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(options);

  const config = new DocumentBuilder()
    .setTitle('List of good things')
    .setDescription('Documentation REST API')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, document, {
    swaggerOptions: { tagsSorter: 'alpha', operationsSorter: 'alpha' },
  });

  await app.listen(4000);
}
bootstrap();
