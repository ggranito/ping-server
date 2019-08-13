
import { isError, isUndefined, isObject } from './TypeChecking'

export enum Cause {
    Unknown,
    NotFound,
    Unimplemented,
    RecognitionConflict
}

export class Failure<C extends Cause, Data = undefined> {
    constructor(readonly cause : C, readonly data: Data) {
        if (cause == Cause.Unknown) {
            if (isError(data)) {
                console.error("UNKNOWN ERROR: " + data.message)
                console.error(data)
            } else {
                console.error("UNKNOWN ERROR: " + JSON.stringify(data))
            }
        }
    }

    static Creator<T extends Cause=Cause>(cause: T) : () => Failure<T, undefined> {
        return () => {
            return new Failure(cause, undefined)
        }
    }

    static CreatorWithData<Data = any, T extends Cause=Cause>(cause: T) : (data: Data) => Failure<T, Data> {
        return (data: Data) => {
            return new Failure(cause, data)
        }
    }

    static wrapPromise = wrapPromise
    static wrapPromiseCause = wrapPromiseCause
}

//Transforms any caught errors into failure objects
export function wrapPromiseCause<T, C extends Cause>(val: PromiseLike<T>, cause: C) : Promise<T | Failure<C, any>> {
    return new Promise<T | Failure<C>>((resolve, reject) => {
        val.then(
            //No Errors -> Resolve
            (value) => resolve(value), 
            //Errors -> resolve with failure
            (reason) => {
                resolve(new Failure(cause, reason))
            }
        )
    })
}

export function wrapPromise<T>(val: PromiseLike<T>) : Promise<T | Failure<Cause.Unknown, any>>{
    return wrapPromiseCause(val, Cause.Unknown)
}


export function isFailure<C extends Cause = Cause, Data=any> (obj: any, cause?: C, dataValidator?: (val: any) => val is Data) : obj is Failure<C, Data>{
    const isAFailure = 
            isObject(obj) &&     //Object is an object
            !isUndefined((obj as Failure<C>).cause) &&
            !isUndefined(Cause[(obj as Failure<C>).cause]);
    
    if (!isAFailure) return false
    
    const causeMatches = 
        isUndefined(cause) || //true if undefined
        (obj as Failure<C>).cause === cause //or true if they're equal

    const dataMatches = 
        isUndefined(dataValidator) || //true if undefined
        dataValidator((obj as Failure<C>).data) //or if it correctly validates

    return causeMatches && dataMatches //only true if they're both true
}

export default Failure