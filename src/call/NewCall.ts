import * as ws from 'ws'
import { isString, isBuffer } from "../util/TypeChecking";
import { Readable } from 'stream';
import { User } from '../user/User';
import AudioPile from '../audiopile/AudioPile';
import WSS from '../servers/WSS';

function dataStreamFromWS(ws: ws) : Readable {
    const dataStream = new Readable()
    ws.binaryType = "nodebuffer"
    
    const handleMsg =  (m : MessageEvent) => {
        if (m.data && isBuffer(m.data)) {
            dataStream.push(m.data)
        }
    }

    const finishWriting = () => {
        ws.off('message', handleMsg)
        ws.off('close', finishWriting)
        ws.off('error', finishWriting)
        dataStream.push(null)
    }
    ws.on('message', handleMsg)
    ws.on('close', finishWriting)
    ws.on('error', finishWriting)
    return dataStream
}

function handleNewCall(ws: ws, user: User) : void {
    const stream = dataStreamFromWS(ws)
    const audioID = AudioPile.newStream(stream)

}

const newCallMiddleware = WSS.newSocketMiddleware((ws, ctx) => {
    handleNewCall(ws, )
})