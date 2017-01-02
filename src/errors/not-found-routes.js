import express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router.get('*', (req, res) => {
  res.status(404).json({
    error: 'Requested endpoint doesn\'t exist. Please consult the documentation.',
    documentation: 'https://github.com/csblogs/api-server/blob/master/README.md'
  });
});

export default router;
