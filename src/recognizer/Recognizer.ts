import { User } from "../user/User";
import { Readable } from "stream";
import { AudioPileID } from "../audiopile/AudioPile";
import { Failure, Cause, isFailure } from "../util/Failure";
import { isObject } from "../util/TypeChecking";

export interface RecognitionConflicts {

}
function isRecognitionConflicts (val: any): val is RecognitionConflicts{
    return isObject(val)
}

export type RecongitionFailure = Failure<Cause.RecognitionConflict, RecognitionConflicts>
export function isRecognitionFailure (val: any): val is RecongitionFailure {
    return isFailure(val, Cause.RecognitionConflict, isRecognitionConflicts)
}


function recognize (caller: User, audio: AudioPileID) : User | RecognitionConflicts {
    
}