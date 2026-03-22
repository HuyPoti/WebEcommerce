import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ResponseInterceptor } from './common/core/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const front_end = process.env.FRONTEND_URL;
  const node_env = process.env.NODE_ENV || 'development';

  // Security: Helmet helps secure your apps by setting various HTTP headers
  app.use(helmet());

  // Global Throttler Guard for rate limiting
  // Note: Only if you want it globally. If not, remove this line and use it on specific controllers.
  // app.useGlobalGuards(new ThrottlerGuard({ /* options */ }, new Reflector()));
  // Alternative: Use APP_GUARD in AppModule for better dependency injection

  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Remove properties that do not have any decorators in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableCors({
    origin: front_end,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  // Cáº¥u hÃ¬nh Swagger - Only in development
  if (node_env === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Flex Style API')
      .setDescription('API documentation for Flex Style e-commerce platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(configService.get('PORT') ?? 8080);
}
bootstrap();

