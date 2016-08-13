import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import request from 'request';
import log from '../../log';
import User from '../../database/models/user';

function getUserInformationFromGithub(accessToken) {
  return new Promise((resolve, reject) => {
    request({
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      },
      url: `https://api.github.com/user?access_token=${accessToken}`
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const githubUser = JSON.parse(body);
        resolve({ authentication_id: githubUser.id.toString(), authentication_provider: 'github' });
      } else {
        reject(error || `Non-OK response from Github (${response.statusCode}) ${body}`);
      }
    });
  });
}

function getUserInformationFromWordpress(accessToken) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://public-api.wordpress.com/rest/v1.1/me',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      }
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const wordpressUser = JSON.parse(body);
        resolve({ authentication_id: wordpressUser.ID, authentication_provider: 'wordpress' });
      } else {
        reject(error || `Non-OK response from Wordpress (${response.statusCode}) ${body}`);
      }
    });
  });
}

function getUserInformationFromStackExchange(accessToken) {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.stackexchange.com/2.2/me/&access_token=${accessToken}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      }
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const stackExchangeResponseObject = JSON.parse(body);
        resolve({ authentication_id: stackExchangeResponseObject.items[0].user_id, authentication_provider: 'stack_exchange' });
      } else {
        reject(error || `Non-OK response from Stack Exchange (${response.statusCode}) ${body}`);
      }
    });
  });
}

function getUserFromService(authenticationProvider, accessToken) {
  let userInformationPromise = null;
  switch (authenticationProvider) {
    case 'github':
      userInformationPromise = getUserInformationFromGithub(accessToken);
      break;
    case 'stack_exchange':
      userInformationPromise = getUserInformationFromStackExchange(accessToken);
      break;
    case 'wordpress':
      userInformationPromise = getUserInformationFromWordpress(accessToken);
      break;
    default:
      return Promise.reject(new Error('Invalid authentication provider (username)'));
  }
  return new Promise((resolve, reject) => {
    userInformationPromise.then(({ authentication_id, authentication_provider }) => {
      User.findOne({
        where: {
          authentication_id,
          authentication_provider
        }
      })
        .then(user => resolve(user))
        .catch(error => reject(error));
    })
      .catch(error => reject(error));
  });
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

export const serviceAuthenticatedOnly = passport.authenticate('basic', { session: false });
