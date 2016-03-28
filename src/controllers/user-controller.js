import User from '../database/models/user';

function removeDatabaseAttributes(users) {
  return users.map(user => {
    const noDBUser = user;
    delete noDBUser.createdAt;
    delete noDBUser.updatedAt;
    return noDBUser;
  });
}

export function getAll() {
  return new Promise((resolve) => {
    User.findAll({
      where: { verified: true },
      raw: true
    })
      .then(allUsers => {
        const apiSafeUsers = removeDatabaseAttributes(allUsers);
        resolve(apiSafeUsers);
      });
  });
}
