import express from 'express';
import * as token from './token-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.post('/', (req, res) => {
  const authenticationProvider = req.body.authenticationProvider;
  const accessToken = req.body.accessToken;
  const accessAppKey = req.body.accessAppKey;

  token.generateAuthenticationToken(authenticationProvider, accessToken, accessAppKey)
    .then(authDetails => res.json(authDetails))
    .catch(error => {
      if (error.name === 'ThirdPartyAuthenticationError') {
        return res.status(422).json({ error: error.message });
      }
      throw error;
    });
});

export default router;
