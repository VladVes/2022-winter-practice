import * as Sentry from '@sentry/node';
import { rollbar } from './rollbar';

export const handleError = (error, ...args) => {
  Sentry.captureException(error);
  rollbar.error(error.message, ...args);
}
