import BlogPost from '../database/models/blog-post';
import log from '../log';

const PUBLIC_API_ATTRIBUTES = [
  'id',
  'title',
  'link',
  'image_uri',
  'description',
  'date_updated',
  'date_published',
  'author_id'
];

const DEFAULT_ORDER = [
  ['date_published', 'DESC']
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
