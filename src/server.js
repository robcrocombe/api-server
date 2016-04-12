import express from 'express';
import LEX from 'letsencrypt-express';

import configureHelmet from './security/configure-helmet';
import database from './database';
import log from './log';
import requestLogger from './log/request-logger';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import notFoundRoute from './routes/not-found';

database.sync()
  .then(() => {
    const app = express();
    configureHelmet(app);
    app.use(requestLogger);

    app.use('/v2.0/users', userRoutes);
    app.use('/v2.0/posts', postRoutes);
    app.use(notFoundRoute);

    const port = process.env.PORT;

    const lex = LEX.create({
      approveRegistration: (hostname, callback) => {
        callback(null, {
          domains: [hostname],
          email: process.env.LETS_ENCRYPT_EMAIL_ADDRESS,
          agreeTos: true
        });
      }
    });

    lex.onRequest = app;
    lex.listen([], [port], function onListen() {
      const protocol = ('requestCert' in this) ? 'https' : 'http';
      const address = this.address();
      log.info({
        address: `${protocol}://${address.address === '::' ? 'localhost' : address.address}:${address.port}`
      }, 'CSBlogs API Server now running');
    });
  });
