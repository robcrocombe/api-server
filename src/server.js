import express from 'express';
import configureHelmet from './security/configure-helmet';
import database from './database';
import log from './log';
import requestLogger from './log/request-logger';
import userRoutes from './components/user/user-routes';
import postRoutes from './components/post/post-routes';
import notFoundRoute from './errors/not-found-routes';

function startServer() {
  database.sync()
    .then(() => {
      log.info('Connected to Database Successfully');

      const app = express();

      configureHelmet(app);
      app.use(requestLogger);

      app.use('/v2.0/users', userRoutes);
      app.use('/v2.0/posts', postRoutes);
      app.use(notFoundRoute);

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
        setTimeout(startServer, 1000);
      }
    });
}

startServer();
