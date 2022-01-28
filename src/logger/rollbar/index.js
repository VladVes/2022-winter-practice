import Rollbar from 'rollbar';

export const rollbar = new Rollbar({
  accessToken: 'e0ffeb6180ef4728999bbb23bb48284a',
  captureUncaught: true,
  captureUnhandledRejections: true,
})
