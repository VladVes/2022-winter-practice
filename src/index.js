import { createApp } from './app';
import config from './config';
import { dbConnect } from './db';

createApp(dbConnect).listen(config.port);
