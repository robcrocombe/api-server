import User from '../database/models/user';

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
  return new Promise((resolve) => {
    User.findAll({
      where: { verified: true },
      raw: true
    })
      .then(allUsers => {
        const apiSafeUsers = allUsers.map(user => removeNonPublicAttributes(user));
        resolve(apiSafeUsers);
      });
  });
}

export function getById(id) {
  return new Promise((resolve) => {
    User.findOne({
      where: {
        id,
        verified: true
      },
      raw: true
    })
      .then(user => {
        user ? resolve(removeNonPublicAttributes(user)) : resolve(null);
      });
  });
}
