import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SeederService } from './auth/seeder.service';
const URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [URL, 'http://localhost:3000'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const seederService = app.get(SeederService);
  await seederService.seedAdminIfNeeded();

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Aplicación iniciada en puerto ${process.env.PORT ?? 3000}`);
}
bootstrap();
