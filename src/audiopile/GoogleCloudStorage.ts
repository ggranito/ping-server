import { Readable } from "stream";
import { AudioPileID } from "./AudioPile";
import { Failure, Cause } from "../util/Failure";

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