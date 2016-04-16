import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import log from '../../log';
import getGithubUser from './get-github-user';
import getStackExchangeUser from './get-stack-exchange-user';
import getWordpressUser from './get-wordpress-user';

function getUserFromService(service, accessToken) {
  switch (service) {
    case 'github':
      return getGithubUser(accessToken);
    case 'stack_exchange':
      return getStackExchangeUser(accessToken);
    case 'wordpress':
      return getWordpressUser(accessToken);
    default:
      return Promise.reject(new Error('Invalid authentication provider (username)'));
  }
}

export function configureAuthentication() {
  passport.use(new BasicStrategy((username, password, done) => {
    log.info({ service: username, accessToken: password }, 'Authenticating');

    getUserFromService(username, password)
      .then(user => {
        user ? done(null, user) : done(null, false);
      })
      .catch(error => {
        log.error({ error: error.message }, 'Error authenticating user');
        done(error);
      });
  }));
}

export const authenticatedOnly = passport.authenticate('basic', { session: false });
