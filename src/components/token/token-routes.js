import express from 'express';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const router = express.Router(); // eslint-disable-line new-cap

function getGitHubUserDetails(accessToken) {
  fetch(`https://api.github.com/user?access_token=${accessToken}`)
    .then(res => res.json())
    .then(json => ({ authenticationProvider: 'github', authenticationId: json.id }));
}

router.post('/', (req, res) => {
  let authentication = null;

  switch (req.body.authenticationProvider) {
    case 'github':
      authentication = getGitHubUserDetails(res.body.accessToken);
      break;
    default:
      return res.status(422).json({ error: 'Authentication Provider required' });
  }

  if (!authentication) {
    return res.status(422).json({ error: `Incorrect ${req.body.authenticationProvider} authentication details provided` });
  }

  const token = jwt.sign(authentication, process.env.CSBLOGS_JWT_SECRET);

  return res.json({
    token
  });
});

export default router;
