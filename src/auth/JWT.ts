import * as JWT from 'jsonwebtoken'
import { isString, isObject, isUndefined, isError } from '../util/TypeChecking'
import { UserID, User } from '../user/User'
import Failure, { Cause, isFailure } from '../util/Failure'
import { BaseContext, Middleware, LoggedInContext } from '../servers/ServerTypes'

const SECRET = process.env.JWT_SECRET
if (!isString(SECRET)) throw Error('No JWT Secret Provided')

// Hypothetical Scheme:
// JWT is considered 'access token' and can be used as auth over a short duration
// (a few mins). However, it can contain a refresh token inside of it that can be
// checked against the DB if the JWT is expired. That way the refresh token can be
// invalidated from the server side.
//
// I decided it was better to just ignore this for now and just use JWTs with long
// expirys with no means of server-side expiry (other than rotating the secret)

interface JWTAuthToken {
    uid: string //user id (short name because it will be passed to the client)
}

const defaultSignOptions = {
    expiresIn: "1y"
}

const sign = (data: JWTAuthToken, options: JWT.SignOptions = defaultSignOptions) => {
    return new Promise<string | Failure<Cause.Unknown, Error>>((resolve, reject) => {
        JWT.sign(data, SECRET, options, (err, token) => {
            if (isError(err)) {
                resolve(Failure.fromError(err))
                return
            }

            if (!isString(token)) {
                resolve(Failure.fromError(new Error('JWT Sign succeeded but not token returned')))
                return
            }
            resolve(token)
        })
    })
}

const verify = (token: string, options = {}) => {
    return new Promise<User | Failure<Cause.InvalidCredentials> | Failure<Cause.Unknown, Error>>((resolve, reject) => {
        JWT.verify(token, SECRET, options, (err, payload) => {
            if (isError(err)) {
                resolve(Failure.create(Cause.InvalidCredentials))
                return
            }

            if (!isObject(payload)) {
                resolve(Failure.fromError(new Error('JWT verify does not contain JSON')))
                return
            }

            const authtoken = payload as JWTAuthToken
            if (!isString(authtoken.uid)) {
                resolve(Failure.fromError(new Error('JWT doesnt have a userid')))
                return
            }

            resolve(new User(UserID.fromValue(authtoken.uid)))
            return
        })
    })
}


export function getAuthToken (user: User) {
    return sign({
        uid: UserID.toValue(user.id)
    })
}

export function authenticateJWT<TContext extends BaseContext>(middleware: Middleware<TContext & LoggedInContext>) {
    return async (ctx: TContext, next: () => Promise<any>) => {
        const token = ctx.headers['auth-token']
        if (isString(token)) {
            const user = await verify(token)
            if (!isFailure(user)) {
                const castedCtx = (ctx as TContext & LoggedInContext);
                castedCtx.state.user = user
                middleware(castedCtx, next)
            }    
        }
        ctx.throw('Invalid Auth Token', 401)
    }
} 