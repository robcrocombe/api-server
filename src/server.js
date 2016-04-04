import express from 'express';
import database from './database';
import log from './log';
import requestLogger from './log/request-logger';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import notFoundRoute from './routes/not-found';

database.sync()
  .then(() => {
    const app = express();
    app.use(requestLogger);

    app.use('/users', userRoutes);
    app.use('/posts', postRoutes);
    app.use(notFoundRoute);

    const port = process.env.CSBLOGS_API_PORT;

    app.listen(port, () => {
      log.info({ port }, 'CSBlogs API now running');
    });
  });
