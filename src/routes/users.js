import express from 'express';
import * as users from '../controllers/user-controller';

const router = express.Router(); // eslint-disable-line new-cap

function respondGetAll(res) {
  users.getAll()
    .then(allUsers => {
      res.json(allUsers);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get list of users' });
    });
}

const DEFAULT_PAGE_SIZE = 10;
function respondGetPage(res, pageNumber, pageSize) {
  users.getPage(pageNumber, pageSize || DEFAULT_PAGE_SIZE)
    .then(pageOfUsers => {
      res.json(pageOfUsers);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get page of users' });
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
  users.getById(id)
    .then(user => {
      user ? res.json(user) : res.status(404).json({ error: 'No such user' });
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get user' });
    });
});

export default router;
