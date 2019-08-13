import { ParameterizedContext } from 'koa'
import * as ws from 'ws';
import { isError } from '../util/TypeChecking';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

export type NewSocketHandler = (socket: ws, ctx: ParameterizedContext) => void

//config 'server'
const wss = new ws.Server({ 
    noServer: true
});
//custom promise because this sucks
const handleUpgradeAsync = (req: IncomingMessage, socket: Socket, buffer: Buffer) : Promise<ws>=> {
    return Promise.race([
        //Handle Upgrade Promise
        new Promise<ws>((resolve, reject) => {
            const err = wss.handleUpgrade.bind(wss)(req, socket, buffer, resolve);
            if (isError(err)) {
                reject(err);
            }
        }),
        
        //Handle timeout
        new Promise<ws>((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("Initializing WS timed out"))
            }, 1000);
        })
    ]).catch<ws>((reason) => {
        socket.destroy();
        throw reason
    });
}

const newSocketMiddleware = (handler: NewSocketHandler) => {
    return async (ctx: ParameterizedContext) => {
        if (!wss.shouldHandle(ctx.req)) throw new Error("404");
        const websocket = await handleUpgradeAsync(ctx.req, ctx.request.socket, Buffer.alloc(0));
        ctx.respond = false;
        handler(websocket, ctx)
    }
}


const WSS = {
    newSocketMiddleware
}
export default  WSS