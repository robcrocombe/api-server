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

function canMerge(merged, mergeLimit) {
  if (mergeLimit) {
    return merged < mergeLimit;
  }
  return true;
}

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

export function getPage(offset, pageSize) {
  return new Promise((resolve, reject) => {
    BlogPost.findAll({
      attributes: PUBLIC_API_ATTRIBUTES,
      order: DEFAULT_ORDER,
      limit: pageSize,
      raw: true,
      offset
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

export function mergeNeighbouringAuthors(posts, pageSize, mergeLimit) {
  if (posts.length < 2) {
    return { posts, count: posts.length };
  }

  const results = [];
  let compare = posts[0];
  let count = 0;
  let merged = 0;

  for (let i = 1; i < posts.length; ++i) {
    count++;

    if (posts[i].author_id === compare.author_id && canMerge(merged, mergeLimit)) {
      if (!compare.more) {
        compare.more = [];
      }
      compare.more.push(posts[i]);
      merged++;
    } else {
      compare = posts[i];
      results.push(posts[i]);
      merged = 0;

      if (results.length === pageSize) {
        break;
      }
    }
  }

  return { posts: results, count };
}
