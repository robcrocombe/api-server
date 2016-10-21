export default function UniqueConstraintError(errors) {
  this.name = 'UniqueConstraintError';
  this.message = 'New User creation failed. See ValidationErrors';
  this.validationErrors = errors;
}
UniqueConstraintError.prototype = new Error();
