import passport from 'passport';
import { BasicStrategy } from 'passport-http';

function validateOAuth(service, accessToken) {
  return new Promise((resolve, reject) => {
    switch (service) {
      case 'github':
        break;
      case 'stack_exchange':
        break;
      case 'wordpress':
        break;
      default:
        reject(new Error('Invalid authentication provider (username)'));
    }
  });
}

passport.use(new BasicStrategy((username, password, done) => {
  validateOAuth(username, password)
    .then(user => {
      user ? done(null, user) : done(null, false);
    })
    .catch(error => done(error));
}));
