import express from 'express';
import * as token from './token-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.post('/', (req, res) => {
  const authenticationProvider = req.body.authenticationProvider;
  const accessToken = req.body.accessToken;
  const accessAppKey = req.body.accessAppKey;
  const missingParams = [];

  if (!authenticationProvider) {
    missingParams.push('authenticationProvider');
  }
  if (!accessToken) {
    missingParams.push('accessToken');
  }
  if (!accessAppKey) {
    missingParams.push('accessAppKey');
  }

  if (missingParams.length > 0) {
    const errorMessage = `Missing parameters: ${missingParams.join(', ')}`;
    return res.status(422).json({ error: errorMessage });
  }

  return token.generateAuthenticationToken(authenticationProvider, accessToken, accessAppKey)
    .then(authDetails => res.json(authDetails))
    .catch(error => {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({ error: error.message });
      }
      return res.status(error.status || 500).json({ error: error.message });
    });
});

export default router;
