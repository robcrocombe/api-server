import express from 'express';
import { serviceAuthenticatedOnly } from '../security/authentication/service-authentication';
import { generateTokenForUser } from '../security/authentication/csb-token-authentication';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/token', serviceAuthenticatedOnly, (req, res) => {
  generateTokenForUser(req.user)
    .then(({ token, expires }) => {
      res.json({
        token,
        expires
      });
    });
});

export default router;
