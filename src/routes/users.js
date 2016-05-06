import express from 'express';
import * as users from '../controllers/user-controller';
import { csbTokenAuthenticatedOnly } from '../security/authentication/csb-token-authentication';

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

function respondGetByVanity(res, vanityName) {
  users.getByVanityName(vanityName)
    .then(user => {
      user ? res.json(user) : res.status(404).json({ error: 'User not found' });
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get user' });
    });
}

function respondGetMany(res, manyIds) {
  const ids = manyIds.split(',').map(id => Number(id));
  users.getManyByIds(ids)
    .then(manyUsers => {
      res.json(manyUsers);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get list of users' });
    });
}

router.post('/', (req, res) => {
  const user = req.body;
  users.register(user)
    .then(registeredUser => {
      res.json(registeredUser);
    })
    .catch(() => {
      res.status(500).json({ error: 'An error occured when registering' });
    });
});

router.get('/', (req, res) => {
  const pageNumber = req.query.page;
  const pageSize = req.query.page_size;

  const vanityName = req.query.vanity_name;
  const manyIds = req.query.ids;

  if (vanityName) {
    respondGetByVanity(res, vanityName);
  } else if (manyIds) {
    respondGetMany(res, manyIds);
  } else if (pageNumber) {
    respondGetPage(res, pageNumber, pageSize);
  } else {
    respondGetAll(res);
  }
});

router.get('/me', csbTokenAuthenticatedOnly, (req, res) => {
  res.json(req.user);
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
