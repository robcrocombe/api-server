import express from 'express';
import log from '../log';
import * as users from '../controllers/user-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  users.getAll()
    .then(allUsers => {
      res.json(allUsers);
    })
    .catch(error => {
      log.error({ error }, 'Error getting a list of users');
      res.status(500).json({ error: 'Could not get list of users' });
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  users.getById(id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'No such user' });
      }
    })
    .catch(error => {
      log.error({ id, error }, 'Error getting user');
      res.status(500).json({ error: 'Could not get user' });
    });
});

export default router;
