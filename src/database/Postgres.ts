import { Pool, Submittable, QueryArrayConfig, QueryConfig, QueryResult, QueryArrayResult} from 'pg'
import { isUndefined } from '../util/TypeChecking';
import Failure, { wrapPromise, Cause, isFailure } from '../util/Failure';

//Pulls connection info from ENV variables
// PGUSER=dbuser
// PGHOST=database.server.com
// PGPASSWORD=secretpassword
// PGDATABASE=mydb
// PGPORT=3211
// Note: Host can also be a Unix Socket (and port isn't needed)
const poolDef = () => {
    return new Pool({
        max: 10 //Max clients (concurrent connections) default 10
    })
};


let pool : Pool | undefined = undefined

function destroyPool () {
    if (isUndefined(pool)) return
    const p = pool
    pool = undefined
    return Failure.wrapPromise(p.end())
}

function getPool () {
    if (isUndefined(pool)) {
        pool = poolDef()
        pool.on('error', (e) => [
            console.error(e)
        ])
    }
    return pool
}

//Need all these declarations to make the typings work. Copied from the pg-node defs
//Can put logging and other stuff in here
//Also wrapped it in the failure catcher so we don't get errors thrown around on await
type Queryable = {
    (queryConfig: QueryArrayConfig, values?: any[]): Promise<QueryArrayResult | Failure<Cause.Unknown>>;
    (queryConfig: QueryConfig): Promise<QueryResult | Failure<Cause.Unknown>>;
    (queryTextOrConfig: string | QueryConfig, values?: any[]): Promise<QueryResult | Failure<Cause.Unknown>>;
}

const query: Queryable = (a: any, b?: any) => {
    return Failure.wrapPromise(getPool().query(a, b))
}

async function executeSequence (executor: (queryable: Queryable) =>  PromiseLike<void | Failure<Cause, Error>>) {
    const client = await Failure.wrapPromise(getPool().connect())
    if (isFailure(client)) {
        return client
    } else {
        const wrappedQuery: Queryable = (a: any, b?: any) => {
            return Failure.wrapPromise(client.query(a, b))
        }
        const result = await executor(wrappedQuery)
        if (isFailure(result)) {
            client.release(result.data)
        } else {
            client.release()
        }
    }
}

export const db = {
    query: query,
    destory: destroyPool,
    executeSequence: executeSequence
}

export default db