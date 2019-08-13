import * as koa from 'koa';
import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser'
import { isNumber } from '../util/TypeChecking';
import * as Router from "./Router"
import * as HTTPS from './HTTPS'

export const startServers = () => {
    //Check Config
    if (!isNumber(process.env.PORT) && !process.env.USE_HTTPS) 
        throw new Error("Listening Port Undefined, and not using HTTPS")

    //Init app
    const app = new koa();

    //setup middleware
    app.use(bodyParser())
    app.use(logger())

    //Add routes
    app.use(Router.routes)


    // start server
    if (process.env.USE_HTTPS) {
        HTTPS.startHttpsServer(app);
        console.log("Started HTTPS Server")
    } else {
        app.listen(process.env.PORT);
        console.log("Started Server on port " + process.env.PORT)
    }
}

