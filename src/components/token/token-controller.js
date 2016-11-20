import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

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

function generateCSBToken(authenticationDetails) {
  return jwt.sign(authenticationDetails, process.env.CSBLOGS_JWT_SECRET);
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
      throw new Error('Authentication Provider Required');
  }

  return getUserDetailsPromise(accessToken, accessAppKey).then(generateCSBToken);
}
