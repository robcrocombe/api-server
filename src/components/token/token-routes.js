import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router(); // eslint-disable-line new-cap

router.post('/', (req, res) => {
  const authentication = {
    authenticationProvider: 'github',
    authenticationId: '4321'
  };

  const token = jwt.sign(authentication, process.env.CSBLOGS_JWT_SECRET);

  res.json({
    token
  });
});

export default router;
