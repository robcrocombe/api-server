export default function FeedLoopError(domain) {
  this.name = 'FeedLoopError';
  this.message = `Blog Feed URL cannot originate from ${domain}`;
}
FeedLoopError.prototype = new Error();
