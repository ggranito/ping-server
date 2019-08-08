import * as ws from 'ws'
import { isString } from "util";

function dataStreamFromWS(ws: ws) : Stream<ArrayBuffer> {
    const dataStream = new Stream<ArrayBuffer>()
    dataStream.forEach
    ws.on('message', (m : MessageEvent) => {
        if (m.data && !isString(m.data)) {

        }
    })

    ws.onerror
}

function handleNewCall(ws: WebSocket, user: User) : void {

}