import BlogPost from './post-model';
import log from '../../log';

const PUBLIC_API_ATTRIBUTES = [
  'id',
  'title',
  'link',
  'imageURI',
  'description',
  'dateUpdated',
  'datePublished',
  'authorId'
];

const DEFAULT_ORDER = [
  ['datePublished', 'DESC']
];

export function getAll() {
  return new Promise((resolve, reject) => {
    BlogPost.findAll({
      attributes: PUBLIC_API_ATTRIBUTES,
      order: DEFAULT_ORDER,
      raw: true
    })
      .then(resolve)
      .catch(error => {
        log.error({ error }, 'Error getting list of all posts');
        reject(error);
      });
  });
}

export function getById(id) {
  return new Promise((resolve, reject) => {
    BlogPost.findOne({
      attributes: PUBLIC_API_ATTRIBUTES,
      where: { id },
      raw: true
    })
      .then(resolve)
      .catch(error => {
        log.error({ error }, 'Error getting blog post by id');
        reject(error);
      });
  });
}

export function getPage(pageNumber, pageSize) {
  return new Promise((resolve, reject) => {
    BlogPost.findAll({
      attributes: PUBLIC_API_ATTRIBUTES,
      order: DEFAULT_ORDER,
      offset: pageNumber * pageSize,
      limit: pageSize,
      raw: true
    })
      .then(resolve)
      .catch(error => {
        log.error({ error }, 'Error getting page of posts');
        reject(error);
      });
  });
}

export function getByAuthor(authorId) {
  return new Promise((resolve, reject) => {
    BlogPost.findAll({
      attributes: PUBLIC_API_ATTRIBUTES,
      order: DEFAULT_ORDER,
      where: {
        author_id: authorId
      },
      raw: true
    })
      .then(resolve)
      .catch(error => {
        log.error({ error }, 'Error getting authors posts');
        reject(error);
      });
  });
}

export function getByAuthorPage(authorId, pageNumber, pageSize) {
  return new Promise((resolve, reject) => {
    BlogPost.findAll({
      attributes: PUBLIC_API_ATTRIBUTES,
      order: DEFAULT_ORDER,
      offset: pageNumber * pageSize,
      limit: pageSize,
      where: {
        author_id: authorId
      },
      raw: true
    })
      .then(resolve)
      .catch(error => {
        log.error({ error }, 'Error getting page of author posts');
        reject(error);
      });
  });
}
