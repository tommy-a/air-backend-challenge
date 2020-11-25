import Koa from 'koa';
import KoaBody from 'koa-body';
import Router from 'koa-router';

import { video } from './routes/video';

export class ApiController {
    readonly router: Router = new Router();

    constructor(readonly app: Koa) {
        this.initRouter();

        // handle parsing of request bodies
        this.app.use(KoaBody());

        // handle valid route requests, and reject all others
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
    }

    private initRouter() {
        video(this.router);
    }
}
