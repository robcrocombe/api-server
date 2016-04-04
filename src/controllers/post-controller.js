import BlogPost from '../database/models/blog-post';

function removeNonPublicAttributes(post) {
  const apiSafePost = post;
  delete apiSafePost.createdAt;
  delete apiSafePost.updatedAt;
  return apiSafePost;
}

export function getAll() {
  return new Promise((resolve) => {
    BlogPost.findAll({
      raw: true
    }).then(allPosts => {
      const apiSafePosts = allPosts.map(post => removeNonPublicAttributes(post));
      resolve(apiSafePosts);
    });
  });
}

export function getById(id) {
  return new Promise((resolve) => {
    BlogPost.findOne({
      where: { id },
      raw: true
    }).then(post => {
      post ? resolve(removeNonPublicAttributes(post)) : resolve(null);
    });
  });
}
