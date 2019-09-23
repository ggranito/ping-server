import * as Cache from 'streaming-cache'
import {v4} from 'uuid'
import { Readable} from 'stream'
import { AudioPileStorage} from '../database/GoogleCloudStorage';
import { Failure, Cause } from '../util/Failure';
import { isUndefined } from '../util/TypeChecking';

const Unknown = Failure.Creator(Cause.Unknown)

export class AudioPileID {
    private str: string
    constructor(str: string){
        this.str = str
    }

    toString () : string {
        return this.str
    }

    static getNewID() : AudioPileID {
        return new AudioPileID(v4())
    }
}

const cache = new Cache({})

function addToCache(dataStream: Readable, id: AudioPileID) {
    dataStream.pipe(cache.set(id.toString()))
}

export function newStream(dataStream: Readable) : AudioPileID {
    const newID = AudioPileID.getNewID()
    addToCache(dataStream, newID)
    return newID
}

function loadFromStorage(id: AudioPileID) : Readable | Failure<Cause.Unknown | Cause.Unimplemented> {
    //todo implement this server attempt
    const serverAttempt : Readable | undefined = undefined
    if(isUndefined(serverAttempt)) {
        return AudioPileStorage.load(id)
    } else {
        addToCache(serverAttempt, id)
        const fromCache = cache.get(id.toString())
        if (isUndefined(fromCache)) {
            return Unknown("AudioPile: Cache returned undefined immediately after adding to it")
        } else {
            return fromCache
        }
    }
}

export function getStream(id: AudioPileID) : Readable | Failure<Cause.Unknown | Cause.Unimplemented>{
    //try cache
    const fromCache = cache.get(id.toString())
    if (isUndefined(fromCache)) {
        return loadFromStorage(id)
    } else {
        return fromCache
    }
}

const AudioPile = {
    newStream,
    getStream
}
export default AudioPile