export default function NotFoundError(subject) {
  this.name = 'NotFoundError';
  this.message = `${subject} not found`;
}
NotFoundError.prototype = new Error();
