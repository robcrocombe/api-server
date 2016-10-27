function formatValidationErrors(ajvErrors) {
  const normalizedErrors = {};

  for (let i = 0; i < ajvErrors.length; ++i) {
    const err = ajvErrors[i];
    const key = err.keyword === 'required' ? err.params.missingProperty : err.dataPath.slice(1);

    const value = ((keyword) => {
      switch (keyword) {
        case 'required':
          return 'cannot be blank';
        case 'minLength':
          return `must be more than ${err.params.limit} characters`;
        case 'maxLength':
          return `must be less than ${err.params.limit} characters`;
        case 'format':
          switch (err.params.format) {
            case 'uri':
              return 'must be a valid URI';
            case 'email':
              return 'must be a valid email address';
            default:
              return err.message;
          }
        case 'pattern':
          switch (err.params.pattern) {
            case '^[a-z]+$':
              return 'must only contain characters a-z';
            default:
              return err.message;
          }
        default:
          return err.message;
      }
    })(err.keyword);

    normalizedErrors[key] = value;
  }

  return normalizedErrors;
}

export default function SchemaValidationError(schemaName, ajvErrors) {
  this.name = 'SchemaValidationError';
  this.message = `${schemaName} validation failed. See ValidationErrors`;
  this.validationErrors = formatValidationErrors(ajvErrors);
}
SchemaValidationError.prototype = new Error();
