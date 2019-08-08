import { isUndefined, isError, isString } from "util";

export enum Cause {
    Unknown,
    NotFound,
    Unimplemented
}

export class Failure<C extends Cause> {
    readonly message? : string
    readonly error? : Error
    private constructor(readonly cause : C, info?: string | Error) {
        if (isString(info)) {
            this.message = info
        } else if (isError(info)) {
            this.error = info
            this.message = info.message
        }
        if (cause == Cause.Unknown) {
            console.error("Unknown Error" + this.message)
            if (!isUndefined(this.error) {
                console.error(this.error)
            }            
        }
    }

    static Creator<T extends Cause>(cause: T) : (info?: string | Error) => Failure<T> {
        return (info?: string) => {
            return new Failure(cause, info)
        }
    }
}

