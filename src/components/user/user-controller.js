import Ajv from 'ajv';
import URI from 'urijs';

import User from './user-model';
import log from '../../log';
import newUserSchema from './new-user-schema.json';
import SchemaValidationError from '../../errors/schema-validation-error';
import UniqueConstraintError from '../../errors/unique-constraint-error';
import FeedLoopError from '../../errors/feed-loop-error';

const CSBLOGS_DOMAIN = 'csblogs.com';

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

function trimNewUserJSON(originalProps) {
  const properties = originalProps;
  const keys = Object.keys(properties);

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];

    properties[key] = properties[key].trim();

    if (properties[key] === '') {
      delete properties[key];
    }
  }

  return properties;
}

function validateNewUserSchema(properties) {
  return new Promise((resolve, reject) => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(newUserSchema);
    if (!validate(properties)) {
      reject(new SchemaValidationError('New User', validate.errors));
    } else {
      resolve(properties);
    }
  });
}

function validateNewUserFeedLoop(properties) {
  const feedURI = new URI(properties.blogFeedURI);

  if (feedURI.domain() === CSBLOGS_DOMAIN) {
    throw new FeedLoopError(CSBLOGS_DOMAIN);
  }

  return properties;
}

function attachAuthenticationDetailsToUser(properties) {
  // <temp>
  const authenticatedUser = properties;
  authenticatedUser.authenticationId = 'temp';
  authenticatedUser.authenticationProvider = 'github';
  // </temp>

  return authenticatedUser;
}

function saveUserToDatabase(properties) {
  return User.create(properties)
    .catch(error => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        const errorInfo = {};

        if (error.fields.vanity_name) {
          errorInfo.vanityName = 'already in use';
        }
        if (error.fields.blog_feed_uri) {
          errorInfo.blogFeedURI = 'already in use';
        }

        throw new UniqueConstraintError(errorInfo);
      }
    });
}

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

export function getById(id, verifiedOnly = true) {
  return new Promise((resolve, reject) => {
    User.findOne({
      attributes: PUBLIC_API_ATTRIBUTES,
      where: {
        id,
        verified: verifiedOnly
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

export function create(properties) {
  const trimmedProps = trimNewUserJSON(properties);

  return validateNewUserSchema(trimmedProps)
          .then(validateNewUserFeedLoop)
          .then(attachAuthenticationDetailsToUser)
          .then(authenticatedUser => saveUserToDatabase(authenticatedUser))
          .then(newUserModel => getById(newUserModel.dataValues.id, false));
}
