import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap'); // Create a logger instance

  app.useGlobalPipes(
    new ValidationPipe({  // Enable validation for incoming requests
      whitelist: true, // Strip properties that are not in the DTOs
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
      // transform: true, // Automatically transform payloads to DTO instances
    }));

  // Set up Swagger for API documentation
  // This will generate a Swagger document based on the decorators in your controllers and DTOs
  const config = new DocumentBuilder()
    .setTitle('Teslo Restful API')
    .setDescription('Teslo Shop RESTful API documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.setGlobalPrefix('api/v1'); // Set the global prefix for all routes

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server is running on port ${process.env.PORT ?? 3000}`); // Log the server start message
}
bootstrap();
