import {Stream, Duplex, Readable} from 'stream'
import {Options} from 'lru-cache'


declare namespace StreamingCache {
    interface CacheOptions extends Options<string, object> {}
}

declare class StreamingCache {
    constructor (opts?: StreamingCache.CacheOptions)
    set: (key: string) => Duplex
    get: (key: string) => Readable | undefined
    del: (key: string) => void
    exists: (key: string) => boolean
    reset: () => void
}

export = StreamingCache

