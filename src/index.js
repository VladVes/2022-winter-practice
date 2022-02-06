import { createApp } from './app';
import config from './config';
import { dbConnect } from './db';

console.log('starting with config', config);
createApp(dbConnect).listen(config.port, () => {
  console.log('app started on port: ', config.port);
});
