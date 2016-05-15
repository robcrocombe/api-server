import express from 'express';
import * as posts from '../controllers/post-controller';

const router = express.Router(); // eslint-disable-line new-cap
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 0;

function respondGetAll(res) {
  posts.getAll()
    .then(allPosts => {
      res.json(allPosts);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get list of posts' });
    });
}

function respondGetAllByAuthor(res, authorId) {
  posts.getByAuthor(authorId)
    .then(allPostsByAuthor => {
      res.json(allPostsByAuthor);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get list of posts by author' });
    });
}

function respondGetPage(res, pageNumber, pageSize) {
  const page = pageNumber || DEFAULT_PAGE_NUMBER;
  const size = pageSize || DEFAULT_PAGE_SIZE;
  const offset = page * size;

  posts.getPage(offset, size)
    .then(pageOfPosts => {
      res.json(pageOfPosts);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get page of posts' });
    });
}

function respondGetMergedAuthorsPage(res, startPos, pageSize, mergeLimit) {
  const offset = parseInt(startPos, 10) || 0;
  const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;
  const merge = parseInt(mergeLimit, 10);
  const limit = size * 5;

  posts.getPage(offset, limit)
    .then(pageOfPosts => {
      const mergedAuthorPosts = posts.mergeNeighbouringAuthors(pageOfPosts, size, merge);
      mergedAuthorPosts.offset = offset + mergedAuthorPosts.count;

      res.json(mergedAuthorPosts);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get page of posts' });
    });
}

function respondGetAuthorPage(res, authorId, pageNumber, pageSize) {
  posts.getByAuthorPage(authorId, pageNumber, pageSize)
    .then(pageOfPosts => {
      res.json(pageOfPosts);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get page of authors posts' });
    });
}

router.get('/', (req, res) => {
  const pageNumber = req.query.page;
  const pageSize = req.query.page_size;
  const authorId = req.query.author_id;
  const mergeAuthors = req.query.merge_authors;
  const mergeLimit = req.query.merge_limit;
  const offset = req.query.offset;

  if (mergeAuthors === 'true') {
    respondGetMergedAuthorsPage(res, offset, pageSize, mergeLimit);
  } else if (authorId && pageNumber) {
    respondGetAuthorPage(res, authorId, pageNumber, pageSize);
  } else if (authorId) {
    respondGetAllByAuthor(res, authorId);
  } else if (pageNumber || pageSize) {
    respondGetPage(res, pageNumber, pageSize);
  } else {
    respondGetAll(res);
  }
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  posts.getById(id)
    .then(post => {
      post ? res.json(post) : res.status(404).json({ error: 'No such post' });
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not get post' });
    });
});

export default router;
