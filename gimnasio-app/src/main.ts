import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SeederService } from './auth/seeder.service';
const URL_LOCAL = process.env.FRONTEND_URL ?? 'http://localhost:5173';
const URL_PROD = process.env.FRONTEND_URL_PROD ?? 'https://rofitness-frontend.onrender.com';
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [URL_LOCAL, 'http://localhost:3000', URL_PROD],
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
