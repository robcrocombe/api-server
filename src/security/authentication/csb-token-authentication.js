import uuid from 'node-uuid';
import moment from 'moment';
import accessToken from '../../database/models/access-token';
import log from '../../log';

export function generateTokenForUser(user) {
  return new Promise((resolve, reject) => {
    const token = uuid.v4();
    const dateExpires = moment().add(process.env.CSBLOGS_TOKEN_EXPIRY_IN_DAYS, 'days');

    accessToken.create({ token, dateExpires, user: user.id })
      .then(() => resolve({ token, dateExpires }))
      .catch(error => {
        log.error({ error }, 'Error adding a token to database');
        reject(new Error('Error persisting a new token'));
      });
  });
}
