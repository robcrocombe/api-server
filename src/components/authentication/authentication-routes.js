import express from 'express';
import { serviceAuthenticatedOnly } from './service-authentication/service-authentication';
import { generateTokenForUser } from './csb-access-token/csb-token-authentication';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/token', serviceAuthenticatedOnly, (req, res) => {
  generateTokenForUser(req.user.id)
    .then(({ token, expires }) => {
      res.json({
        token,
        expires
      });
    });
});

export default router;
