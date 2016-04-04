import express from 'express';
import * as posts from '../controllers/post-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  posts.getAll()
    .then(allPosts => {
      res.json(allPosts);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get list of posts' });
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  posts.getById(id)
    .then(post => {
      post ? res.json(post) : res.status(404).json({ error: 'No such post' });
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get post' });
    });
});

export default router;
