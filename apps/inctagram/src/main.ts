import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import process from 'process';
import { setupApp } from './setup-app';
import { SwaggerConfig } from '../../../libs/adapters/api-doc/swagger.setup';

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app = setupApp(app);
  SwaggerConfig.setup(app);
  await app.listen(process.env.PORT || 3000);
  SwaggerConfig.writeSwaggerFile();
}
bootstrap();