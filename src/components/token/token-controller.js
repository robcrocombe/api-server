import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import * as users from '../user/user-controller';

function getGitHubUserDetails(accessToken) {
  return fetch(`https://api.github.com/user?access_token=${accessToken}`)
    .then(res => {
      if (res.status === 200) {
        return res;
      }
      throw new Error(res.statusText);
    })
    .then(res => res.json())
    .then(json => ({ authenticationProvider: 'github', authenticationId: `${json.id}` }));
}

function getWordpressUserDetails(accessToken) {
  return fetch('https://public-api.wordpress.com/rest/v1.1/me', {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })
    .then(res => {
      if (res.status === 200) {
        return res;
      }
      throw new Error(res.statusText);
    })
    .then(res => res.json)
    .then(json => ({ authenticationProvider: 'wordpress', authenticationId: `${json.ID}` }));
}

function getStackExchangeUserDetails(accessToken, accessAppKey) {
  return fetch(`https://api.stackexchange.com/2.2/me?site=stackoverflow&access_token=${accessToken}&key=${accessAppKey}`)
    .then(res => {
      if (res.status === 200) {
        return res;
      }
      throw new Error(res.statusText);
    })
    .then(res => res.json())
    .then(json => ({ authenticationProvider: 'stack_exchange', authenticationId: `${json.items[0].user_id}` }));
}

function generateCSBToken(user) {
  return {
    isRegistered: user.isRegistered,
    csbToken: jwt.sign(user.authDetails, process.env.CSBLOGS_JWT_SECRET)
  };
}

function setIsRegisteredUser(authDetails) {
  return users.getByAuthenticationDetails(authDetails.authenticationProvider, authDetails.authenticationId)
    .then(user => ({
      isRegistered: (user != null),
      authDetails
    }))
    .catch(() => ({
      isRegistered: false,
      authDetails
    }));
}

export function generateAuthenticationToken(authenticationProvider, accessToken, accessAppKey) { // eslint-disable-line import/prefer-default-export
  let getUserDetailsPromise = null;
  switch (authenticationProvider.toLowerCase()) {
    case 'github':
      getUserDetailsPromise = getGitHubUserDetails;
      break;
    case 'wordpress':
      getUserDetailsPromise = getWordpressUserDetails;
      break;
    case 'stack_exchange':
      getUserDetailsPromise = getStackExchangeUserDetails;
      break;
    default:
      return Promise.reject((() => {
        const error = new Error('Invalid authentication provider');
        error.status = 422;
        return error;
      })());
  }

  return getUserDetailsPromise(accessToken, accessAppKey)
    .then(setIsRegisteredUser)
    .then(generateCSBToken);
}
