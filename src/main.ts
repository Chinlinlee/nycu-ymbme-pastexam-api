import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as session from 'express-session';
import { ExpressAdapter } from '@nestjs/platform-express';
import { config } from './config';
import * as SequelizeStore from 'connect-session-sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const sequelize = new Sequelize(config.SQL);
  await sequelize.authenticate();
  const sequelizeStore = SequelizeStore(session.Store);
  const expressInstance = express();
  expressInstance.use(express.json());
  expressInstance.use(express.urlencoded({ extended: false }));
  let myStore = new sequelizeStore({
    db: sequelize,
  });
  expressInstance.use(
    session({
      secret: config.ENV.sessionSecret,
      resave: false, 
      saveUninitialized: true,
      store: myStore,
      proxy: true
    })
  );
  myStore.sync();
  const adapter  = new ExpressAdapter(expressInstance);

  const app = await NestFactory.create(AppModule, adapter);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      "http://localhost:8100"
    ],
    credentials: true
  });
  await app.listen(3000);
}
bootstrap();
