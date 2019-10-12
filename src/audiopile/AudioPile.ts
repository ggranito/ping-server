import * as Cache from 'streaming-cache'
import { Readable} from 'stream'
import { AudioPileStorage} from '../database/GoogleCloudStorage';
import { Failure, Cause } from '../util/Failure';
import { isUndefined } from '../util/TypeChecking';
import { User, UserID } from '../user/User';
import { DB } from '../database/Postgres'


const cache = new Cache({})

const Unknown = Failure.Creator(Cause.Unknown);

const Queries = {
    newEntry:  (creatorID : UserID) => {
        if (isUndefined(creatorID)) {
            `INSERT INTO audiopile VALUES (${creatorID})`
        }
    }
}


export class AudioPileEntry {
    private id: string

    private info: undefined | {
        creator: User | undefined
    }

    private constructor(id: string){
        this.id = id
    }


    private static newEntryQuery(creator?: User) {
        const creatorStr = isUndefined(creator) ? `NULL` : `'${creator.id}'`
        return ``
    }
    static async newEntry(creator?: User) : Promise<AudioPileEntry> {
        const creatorID = isUndefined(creator) ? "NULL" : creator.id.toRaw();
        DB.query()
    }
}







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