import express from 'express';
import * as posts from '../controllers/post-controller';

const router = express.Router(); // eslint-disable-line new-cap

function respondGetAll(res) {
  posts.getAll()
    .then(allPosts => {
      res.json(allPosts);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get list of posts' });
    });
}

const DEFAULT_PAGE_SIZE = 10;
function respondGetPage(res, pageNumber, pageSize) {
  posts.getPage(pageNumber, pageSize || DEFAULT_PAGE_SIZE)
    .then(pageOfPosts => {
      res.json(pageOfPosts);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get page of posts' });
    });
}

router.get('/', (req, res) => {
  const pageNumber = req.query.page;
  const pageSize = req.query.page_size;

  if (pageNumber) {
    respondGetPage(res, pageNumber, pageSize);
  } else {
    respondGetAll(res);
  }
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
