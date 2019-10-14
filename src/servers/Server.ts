import * as koa from 'koa';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser'
import { isNumber } from '../util/TypeChecking';
import * as Router from "./Router"
import * as HTTPS from './HTTPS'
import { IRouterParamContext } from 'koa-router';
import { User } from '../user/User';
import compose = require('koa-compose');
import { BaseState } from './ServerTypes';

export const startServers = () => {
    //Check Config
    if (!isNumber(process.env.PORT) && !process.env.USE_HTTPS) 
        throw new Error("Listening Port Undefined, and not using HTTPS")

    //Init app
    const app = (new koa<BaseState>())

    //setup middleware
        .use<BaseState>(bodyParser())
        .use<BaseState>(logger())

    //Add routes
        .use(Router.routes)


    // start server
    if (process.env.USE_HTTPS) {
        HTTPS.startHttpsServer(app);
        console.log("Started HTTPS Server")
    } else {
        app.listen(process.env.PORT);
        console.log("Started Server on port " + process.env.PORT)
    }
}
