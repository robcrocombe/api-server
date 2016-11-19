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
    .then(json => ({ authenticationProvider: 'github', authenticationId: json.id }));
}

function generateCSBToken(authenticationDetails) {
  return jwt.sign(authenticationDetails, process.env.CSBLOGS_JWT_SECRET);
}

export function generateAuthenticationToken(authenticationProvider, accessToken) { // eslint-disable-line import/prefer-default-export
  let getUserDetailsPromise = null;
  switch (authenticationProvider.toLowerCase()) {
    case 'github':
      getUserDetailsPromise = getGitHubUserDetails;
      break;
    default:
      throw new Error('Authentication Provider Required');
  }

  return getUserDetailsPromise(accessToken).then(generateCSBToken);
}
