import User from '../database/models/user';
import log from '../log';
import { Validator } from 'jsonschema';
import registerUserSchema from '../schemas/register-user.schema.json';

const PUBLIC_API_ATTRIBUTES = [
  'id',
  'authentication_id',
  'authentication_provider',
  'first_name',
  'last_name',
  'profile_picture_uri',
  'vanity_name',
  'bio',
  'website_uri',
  'blog_uri',
  'blog_feed_uri',
  'cv_uri',
  'linkedin_uri',
  'github_username',
  'twitter_username'
];

const DEFAULT_ORDER = [
  ['first_name', 'ASC']
];

export function getAll() {
  return new Promise((resolve, reject) => {
    User.findAll({
      attributes: PUBLIC_API_ATTRIBUTES,
      order: DEFAULT_ORDER,
      where: { verified: true },
      raw: true
    })
      .then(resolve)
      .catch(error => {
        log.error({ error }, 'Error getting list of all users');
        reject(error);
      });
  });
}

export function getManyByIds(ids) {
  return new Promise((resolve, reject) => {
    User.findAll({
      attributes: PUBLIC_API_ATTRIBUTES,
      where: {
        id: ids, // Sequelize automatically does 'in'
        verified: true
      },
      raw: true
    })
      .then(foundUsers => {
        const allUsers = foundUsers;

        if (allUsers.length !== ids.length) {
          // One or more of requested users doesn't exist. Add error to result
          const foundIds = foundUsers.map(user => user.id);
          const unfoundIds = ids.filter(id => !foundIds.includes(id));
          unfoundIds.forEach(id => {
            allUsers.push({
              id,
              error: 'User not found'
            });
          });
        }

        const usersHash = { };
        allUsers.forEach(user => {
          usersHash[user.id] = user;
        });

        resolve(usersHash);
      })
      .catch(error => {
        log.error({ error, ids }, 'Error getting many users by id');
        reject(error);
      });
  });
}

export function getById(id) {
  return new Promise((resolve, reject) => {
    User.findOne({
      attributes: PUBLIC_API_ATTRIBUTES,
      where: {
        id,
        verified: true
      },
      raw: true
    })
      .then(resolve)
      .catch(error => {
        log.error({ error, id }, 'Error getting user by id');
        reject(error);
      });
  });
}

export function getByVanityName(vanityName) {
  return new Promise((resolve, reject) => {
    User.findOne({
      attributes: PUBLIC_API_ATTRIBUTES,
      where: {
        vanityName,
        verified: true
      },
      raw: true
    })
      .then(resolve)
      .catch(error => {
        log.error({ error, vanityName }, 'Error getting user by vanity name');
        reject(error);
      });
  });
}

export function getPage(pageNumber, pageSize) {
  return new Promise((resolve, reject) => {
    User.findAll({
      attributes: PUBLIC_API_ATTRIBUTES,
      order: DEFAULT_ORDER,
      where: {
        verified: true
      },
      offset: pageNumber * pageSize,
      limit: pageSize,
      raw: true
    })
      .then(resolve)
      .catch(error => {
        log.error({ error }, 'Error getting page of users');
        reject(error);
      });
  });
}

export function register(newUser) {
  return new Promise((resolve, reject) => {
    const validator = new Validator();
    const validationResult = validator.validate(newUser, registerUserSchema);

    if (validationResult.valid) {
      User.create(newUser)
      .then(() => resolve())
      .catch(error => {
        log.info({ newUser, error }, 'Error adding new user to database');
        reject(error);
      });
    } else {
      const error = new Error('Invalid new user');
      error.validationProblems = validationResult.errors;
      reject(error);
    }
  });
}
