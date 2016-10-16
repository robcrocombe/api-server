import normalizeAjvErrors from 'ajv-error-messages';

function formatValidationErrors(ajvErrors) {
  const normalizedAjvErrors = normalizeAjvErrors(ajvErrors);
  normalizedAjvErrors.fields[''].forEach(requiredMessage => {
    const missingFieldName = requiredMessage.split('\'')[1];

    if(!normalizedAjvErrors.fields[`${missingFieldName}`]) {
      normalizedAjvErrors.fields[`${missingFieldName}`] = [];
    }
    normalizedAjvErrors.fields[`${missingFieldName}`].push('required');
  });

  delete normalizedAjvErrors.fields['']

  const validationErrors = normalizedAjvErrors.fields;
  return validationErrors;
}

export default function SchemaValidationError(schemaName, ajvErrors) {
  this.name = 'SchemaValidationError';
  this.message = `${schemaName} validation failed. See ValidationErrors`;
  this.validationErrors = formatValidationErrors(ajvErrors);
}
SchemaValidationError.prototype = new Error();
