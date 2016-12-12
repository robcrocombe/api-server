import express from 'express';
import bodyParser from 'body-parser';

import log from './log';
import database from './database';
import configureHelmet from './middleware/configure-helmet';
import requestLogger from './middleware/request-logger';
import userRoutes from './components/user/user-routes';
import postRoutes from './components/post/post-routes';
import tokenRoutes from './components/token/token-routes';
import notFoundRoute from './errors/not-found-routes';
import unexpectedErrorRoute from './errors/unexpected-error-routes';
import bodyParserSyntaxError from './errors/body-parser-json-syntax-error';

export default function start() {
  database.sync()
    .then(() => {
      log.info('Connected to Database Successfully');

      const app = express();

      configureHelmet(app);
      app.use(requestLogger);
      app.use(bodyParser.json());
      app.use(bodyParserSyntaxError);

      app.use('/v2.0/user', userRoutes);
      app.use('/v2.0/post', postRoutes);
      app.use('/v2.0/token', tokenRoutes);
      app.use(notFoundRoute);
      app.use(unexpectedErrorRoute);

      const port = process.env.PORT;

      app.listen(port, () => {
        log.info({ port }, 'CSBlogs API now running');
      });
    })
    .catch(error => {
      if (error instanceof database.ConnectionError) {
        log.info('Connection to Database Failed', {
          host: process.env.CSBLOGS_DATABASE_HOST,
          port: process.env.CSBLOGS_DATABASE_PORT,
          name: process.env.CSBLOGS_DATABASE_NAME,
          username: process.env.CSBLOGS_DATABASE_USERNAME
        });
        setTimeout(start, 1000);
      }
    });
}

// startServer();
