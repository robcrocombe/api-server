import log from '../log';

export default function unexpectedErrorRoute(err, req, res, next) { // eslint-disable-line no-unused-vars
  log.error('Uncaught exception', err);

  res.status(500).json({
    error: 'An unexpected error occured. Please try again. If the error persists please submit an issue',
    issues: 'https://github.com/csblogs/api-server/issues'
  });
}
