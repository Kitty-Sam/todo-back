import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

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
