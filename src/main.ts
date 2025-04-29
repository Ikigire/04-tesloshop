import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1'); // Set the global prefix for all routes

  app.useGlobalPipes(
    new ValidationPipe({  // Enable validation for incoming requests
      whitelist: true, // Strip properties that are not in the DTOs
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
      // transform: true, // Automatically transform payloads to DTO instances
    }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
