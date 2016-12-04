import express from 'express';
import * as users from './user-controller';
import log from '../../log';
import { authenticate, authenticateUnregistered } from '../../middleware/authenticate';

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
const DEFAULT_PAGE_NUMBER = 0;
function respondGetPage(res, pageNumber, pageSize) {
  users.getPage(pageNumber || DEFAULT_PAGE_NUMBER, pageSize || DEFAULT_PAGE_SIZE)
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

router.post('/', authenticateUnregistered, (req, res) => {
  users.create(req.body, req.user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      switch (error.name) {
        case 'SchemaValidationError':
        case 'UniqueConstraintError':
        case 'FeedLoopError':
          res.status(422).json({ error: error.message, validationErrors: error.validationErrors });
          break;
        default:
          log.error('An unexpected error occured', error);
          res.status(500).json({ error: 'An unexpected error occured' });
          break;
      }
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
  } else if (pageNumber || pageSize) {
    respondGetPage(res, pageNumber, pageSize);
  } else {
    respondGetAll(res);
  }
});

router.get('/me', authenticateUnregistered, (req, res) => {
  users.getByAuthenticationDetails(req.user.authenticationProvider, req.user.authenticationId)
    .then(user => {
      user ? res.json(user) : res.status(404).json({ error: 'User not found' });
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get user' });
    });
});

router.put('/me', authenticate, (req, res) => {
  users.update(req.body, req.user.id)
    .then(updatedUser => {
      res.json({ updatedUser });
    })
    .catch((error) => {
      switch (error.name) {
        case 'NotFoundError':
          res.status(404).json({ error: error.message });
          break;
        case 'SchemaValidationError':
        case 'UniqueConstraintError':
        case 'FeedLoopError':
          res.status(422).json({ error: error.message, validationErrors: error.validationErrors });
          break;
        default:
          log.error('An unexpected error occured', error);
          res.status(500).json({ error: 'An unexpected error occured' });
          break;
      }
    });
});

router.delete('/me', authenticate, (req, res) => {
  users.removeById(req.user.id)
    .then(() => {
      res.json({ deleted: req.user.id });
    })
    .catch(error => {
      res.status(500).json({
        error: error.message || 'Unable to delete this user'
      });
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  users.getById(id)
    .then(user => {
      user ? res.json(user) : res.status(404).json({ error: 'User not found' });
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get user' });
    });
});

export default router;
