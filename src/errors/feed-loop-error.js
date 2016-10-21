export default function FeedLoopError(domain) {
  this.name = 'FeedLoopError';
  this.message = 'New User creation failed. See ValidationErrors';
  this.validationErrors = {
    blogFeedURI: `Blog Feed URL cannot originate from ${domain}`
  };
}
FeedLoopError.prototype = new Error();
