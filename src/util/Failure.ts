
import { isError, isUndefined, isObject, Typeguard } from './TypeChecking'

export enum Cause {
    //General Errors
    Unknown,
    NotFound,
    Unimplemented,
    ParseError,

    //DB Errors
    DBError,

    //User Errors
    UsernameTaken,
    InvalidCredentials
}

export class Failure<C extends Cause, Data = undefined> {
    constructor(readonly cause : C, readonly data: Data, readonly msg?: string) {
        if (cause == Cause.Unknown) {
            if (isError(data)) {
                console.error("UNKNOWN ERROR: " + data.message)
                console.error(data)
            } else if (!isUndefined(msg)){
                console.error("UNKNOWN ERROR: " + msg)
                console.error(JSON.stringify(data))
            } else {
                console.error("UNKNOWN ERROR: " + JSON.stringify(data))
            }
        }
    }

    static fromError(err: Error) : Failure<Cause.Unknown, Error> {
        return new Failure(Cause.Unknown, err);
    }

    static create<T extends Cause=Cause>(cause: T, msg?: string) : Failure<T, undefined> {
        return new Failure(cause, undefined, msg)
    }

    static Creator<T extends Cause=Cause>(cause: T) : (msg? : string) => Failure<T, undefined> {
        return (msg? : string) => {
            return new Failure(cause, undefined, msg)
        }
    }

    static CreatorWithData<Data = any, T extends Cause=Cause>(cause: T, msg?: string) : (data: Data) => Failure<T, Data> {
        return (data: Data, msg?: string) => {
            return new Failure(cause, data, msg)
        }
    }

    static wrapPromise = wrapPromise
    static wrapPromiseCause = wrapPromiseCause
    static wrapFunctionCause = wrapFunctionCause
}

//Transforms any caught errors into failure objects
export function wrapPromiseCause<T, C extends Cause, Data=any>(val: PromiseLike<T>, cause: C, dataGuard?: Typeguard<Data>) : Promise<T | Failure<C, Data> | Failure<Cause.Unknown, any>> {
    return new Promise((resolve, reject) => {
        val.then(
            //No Errors -> Resolve
            (value) => resolve(value), 
            //Errors -> resolve with failure
            (reason) => {
                if (!isUndefined(dataGuard) && dataGuard(reason)) {
                    resolve(new Failure(cause, reason))
                } else {
                    resolve(new Failure(Cause.Unknown, reason))
                }
            }
        )
    })
}

export function wrapPromise<T>(val: PromiseLike<T>) : Promise<T | Failure<Cause.Unknown, any>>{
    return wrapPromiseCause(val, Cause.Unknown)
}

export function wrapFunctionCause<Args extends any[], Ret, C extends Cause, Data=any>(fn: (...args: Args) => PromiseLike<Ret>, cause: C, dataGuard?: Typeguard<Data>) {
    return (...args: Args) => {
        return wrapPromiseCause(fn(...args), cause, dataGuard)
    }
}

export function isFailure<C extends Cause = Cause, Data=any> (obj: any, cause?: C, dataValidator?: (val: any) => val is Data) : obj is Failure<C, Data>{
    //Check if it's a failure
    if (!(obj instanceof Failure)) {
        return false
    }
    
    //Check if causes match
    if (!isUndefined(cause)) {
        if (obj.cause !== cause) {
            return false
        }
    }

    //Check data validator
    if (!isUndefined(dataValidator)) {
        if (!dataValidator((obj as Failure<C>).data)) {
            return false
        }
    }

    return true //if not filtered by above checks, it matches
}

export default Failure