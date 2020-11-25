import Koa from 'koa';

import { ApiController } from './api-controller';

const app = new Koa();
const controller = new ApiController(app);

// start
app.listen(3000);
