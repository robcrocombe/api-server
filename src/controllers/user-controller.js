import User from '../database/models/user';
import log from '../log';

function removeNonPublicAttributes(user) {
  const apiSafeUser = user;
  delete apiSafeUser.emailAddress;
  delete apiSafeUser.createdAt;
  delete apiSafeUser.updatedAt;
  delete apiSafeUser.verified;
  delete apiSafeUser.feedLastModified;
  return apiSafeUser;
}

export function getAll() {
  return new Promise((resolve, reject) => {
    User.findAll({
      order: [
        ['first_name', 'ASC']
      ],
      where: { verified: true },
      raw: true
    })
      .then(allUsers => {
        const apiSafeUsers = allUsers.map(user => removeNonPublicAttributes(user));
        resolve(apiSafeUsers);
      })
      .catch(error => {
        log.error({ error }, 'Error getting list of all users');
        reject(error);
      });
  });
}

export function getById(id) {
  return new Promise((resolve, reject) =>
    User.findOne({
      where: {
        id,
        verified: true
      },
      raw: true
    })
      .then(user => {
        user ? resolve(removeNonPublicAttributes(user)) : resolve(null);
      })
      .catch(error => {
        log.error({ error, id }, 'Error getting user by id');
        reject(error);
      })
  );
}

export function getPage(pageNumber, pageSize) {
  return new Promise((resolve, reject) => {
    User.findAll({
      where: {
        verified: true
      },
      offset: pageNumber * pageSize,
      limit: pageSize,
      raw: true
    })
      .then(pageOfUsers => {
        resolve(pageOfUsers);
      })
      .catch(error => {
        log.error({ error }, 'Error getting page of users');
        reject(error);
      });
  });
}
