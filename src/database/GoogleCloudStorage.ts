import { Readable } from "stream";
import { AudioPileID } from "../audiopile/AudioPile";
import { Failure, Cause } from "../util/Failure";
import { Storage } from '@google-cloud/storage'

const storage = new Storage()
const bucketExists = await storage.

const Unimplemented = Failure.Creator(Cause.Unimplemented)

export function load(id: AudioPileID) : Readable | Failure<Cause.Unimplemented> {
    return Unimplemented("I'm kinda tired")
}

export function store(id: AudioPileID, stream: Readable) : Failure<Cause.Unimplemented> | undefined {
    return Unimplemented("I could keep going")
}

export const AudioPileStorage = {
    load,
    store
}
export default AudioPileStorage