import passport from 'passport';
import CustomStrategy from 'passport-custom';

import uuid from 'node-uuid';
import moment from 'moment';
import accessToken from '../../database/models/access-token';
import log from '../../log';
import * as userController from '../../controllers/user-controller';

export function generateTokenForUser(userId) {
  return new Promise((resolve, reject) => {
    const token = uuid.v4();
    const dateExpires = moment().add(process.env.CSBLOGS_TOKEN_EXPIRY_IN_DAYS, 'days');

    accessToken.create({ token, dateExpires, user_id: userId })
      .then(() => resolve({ token, dateExpires }))
      .catch(error => {
        log.error({ error }, 'Error adding a token to database');
        reject(new Error('Error persisting a new token'));
      });
  });
}

passport.use('csb-token', new CustomStrategy(
  (req, done) => {
    const httpAuthorizationToken = req.get('Authorization');
    if (!httpAuthorizationToken) {
      log.error('Request requiring token auth made with no token supplied');
      return done(new Error('No token supplied'));
    }

    return accessToken.findOne({
      where: {
        token: httpAuthorizationToken,
        dateExpires: {
          $gt: new Date()
        }
      }
    })
      .then(token => {
        if (token) {
          return userController.getById(token.user_id);
        }
        log.error({ httpAuthorizationToken }, 'Request was made with a token that doesn\'t exist or is expired');
        return done(new Error('Invalid token'));
      })
      .then(user => {
        if (user) {
          log.info({ user }, 'User successfully authenticated');
          done(null, user);
        }
      })
      .catch(error => {
        log.error({ error }, 'Error retrieving a token from database');
        done(new Error('Error retrieving token'));
      });
  }
));

export const csbTokenAuthenticatedOnly = passport.authenticate('csb-token', { session: false });
