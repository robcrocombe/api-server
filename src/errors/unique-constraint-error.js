export default function UniqueConstraintError(message) {
  this.name = 'UniqueConstraintError';
  this.message = message;
}
UniqueConstraintError.prototype = new Error();
