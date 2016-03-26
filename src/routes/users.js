import express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  res.status(404).json({ error: 'Not yet implemented' });
});

export default router;
