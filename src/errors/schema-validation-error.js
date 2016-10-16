export default function SchemaValidationError(message) {
  this.name = 'SchemaValidationError';
  this.message = message;
}
SchemaValidationError.prototype = new Error();
