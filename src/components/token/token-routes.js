import express from 'express';
import * as token from './token-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.post('/', (req, res) => {
  const authenticationProvider = req.body.authenticationProvider;
  const accessToken = req.body.accessToken;
  token.generateAuthenticationToken(authenticationProvider, accessToken)
    .then(csbToken => res.json({ csbToken }))
    .catch(error => {
      if (error.name === 'ThirdPartyAuthenticationError') {
        return res.status(422).json({ error: error.message });
      }
      throw error;
    });
});

export default router;
