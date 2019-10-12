import { isUndefined, isNull } from '../util/TypeChecking';
import Failure, { Cause, isFailure, wrapFunctionCause } from '../util/Failure';
import { DatabasePoolType, createPool, SlonikError, BackendTerminatedError, NotFoundError, InvalidInputError, UnexpectedStateError, ConnectionError, QueryCancelledError, DataIntegrityError, IntegrityConstraintViolationError, NotNullIntegrityConstraintViolationError, ForeignKeyIntegrityConstraintViolationError, UniqueIntegrityConstraintViolationError, CheckIntegrityConstraintViolationError, QueryResultRowType} from 'slonik'

// Note Need Pulls connection info from ENV variables
//Connection URI follows structure:
// - https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
let pool = createPool("postgres://pingapp:pingapp@35.233.137.232/ping", 
    //Configuration Options
    {
        // captureStackTrace: true,
        // connectionTimeout: 5000,
        // idleTimeout: 5000,
        // interceptors: [],
        // maximumPoolSize: 10,
        // minimumPoolSize: 0,
        // typeParsers,
    }
)

//Note: Need to bind to pool incase it uses 'this' anywhere
export const DB = {
    any: wrapFunctionCause(pool.any.bind(pool), Cause.DBError, isDBError),
    anyFirst: wrapFunctionCause(pool.anyFirst.bind(pool), Cause.DBError, isDBError),
    many: wrapFunctionCause(pool.many.bind(pool), Cause.DBError, isDBError),
    manyFirst: wrapFunctionCause(pool.manyFirst.bind(pool), Cause.DBError, isDBError),
    maybeOne: wrapFunctionCause(pool.maybeOne.bind(pool), Cause.DBError, isDBError),
    maybeOneFirst: wrapFunctionCause(pool.maybeOneFirst.bind(pool), Cause.DBError, isDBError),
    one: wrapFunctionCause(pool.one.bind(pool), Cause.DBError, isDBError),
    oneFirst: wrapFunctionCause(pool.oneFirst.bind(pool), Cause.DBError, isDBError),
    query: wrapFunctionCause(pool.query.bind(pool), Cause.DBError, isDBError),
    connect: wrapFunctionCause(pool.connect.bind(pool), Cause.DBError, isDBError),
    stream: wrapFunctionCause(pool.stream.bind(pool), Cause.DBError, isDBError),
    transaction: wrapFunctionCause(pool.transaction.bind(pool), Cause.DBError, isDBError)
}

export default DB

//Forcibly cast to T if column is defined in the row
export function parseRow<T=string>(row: QueryResultRowType, column: string) : T | undefined {
    const val = row[column]
    if (!isUndefined(val) && !isNull(val)) {
        return row[column] as any as T
    } else {
        return undefined
    }
}



//ERROR HANDLING
export interface DBError extends SlonikError {}

//DB Error Type Checking
export function isDBError(value: any): value is DBError {
    return value instanceof SlonikError
}

export function isInvalidInputError(value: any): value is InvalidInputError {
    return value instanceof InvalidInputError
}

export function isUnexpectedStateError(value: any): value is UnexpectedStateError {
    return value instanceof UnexpectedStateError
}

export function isConnectionError(value: any): value is ConnectionError {
    return value instanceof ConnectionError
}

export function isQueryCancelledError(value: any): value is QueryCancelledError {
    return value instanceof QueryCancelledError
}

export function isBackendTerminatedError(value: any): value is BackendTerminatedError {
    return value instanceof BackendTerminatedError
}

export function isNotFoundError(value: any): value is NotFoundError {
    return value instanceof NotFoundError
}

export function isDataIntegrityError(value: any): value is DataIntegrityError {
    return value instanceof DataIntegrityError
}

export function isIntegrityConstraintViolationError(value: any): value is IntegrityConstraintViolationError {
    return value instanceof IntegrityConstraintViolationError
}

export function isNotNullIntegrityConstraintViolationError(value: any): value is NotNullIntegrityConstraintViolationError {
    return value instanceof NotNullIntegrityConstraintViolationError
}

export function isForeignKeyIntegrityConstraintViolationError(value: any): value is ForeignKeyIntegrityConstraintViolationError {
    return value instanceof ForeignKeyIntegrityConstraintViolationError
}

export function isUniqueIntegrityConstraintViolationError(value: any): value is UniqueIntegrityConstraintViolationError {
    return value instanceof UniqueIntegrityConstraintViolationError
}

export function isCheckIntegrityConstraintViolationError(value: any): value is CheckIntegrityConstraintViolationError {
    return value instanceof CheckIntegrityConstraintViolationError
}

