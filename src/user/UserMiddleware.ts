import { LoggedInMiddleware, Middleware, BaseContext } from "../servers/ServerTypes";
import { isObject, isString } from "../util/TypeChecking";
import { login, createUserWithPassword } from '../user/PasswordAuth'
import { isFailure, Cause } from "../util/Failure";
import { getAuthToken } from '../auth/JWT'
import _ = require("lodash");



/*
 * Login With Username and Password Middleware
 */

interface CredentialRequest {
    username: string,
    password: string
}

function parseCredsOrThrow(ctx: BaseContext) : CredentialRequest {
    const body = ctx.request.body;
    const username = _.get(body, "username")
    const password = _.get(body, "password")
    if (isString(username) && isString(password)) {
        return {
            username,
            password
        }
    }
    throw ctx.throw("Bad Request", 400)
}

export const loginPasswordMiddleware : Middleware = async (ctx) => {
    const {username, password} = parseCredsOrThrow(ctx)
    const user = await login(username, password)
    if (isFailure(user)) {
        if (user.cause == Cause.InvalidCredentials) {
            throw ctx.throw('Invalid Credentials', 401)
        } else {
            throw ctx.throw('Server Error', 500)
        }
    }

    //Login Successful
    const token = await getAuthToken(user)
    if (isFailure(token)) {
        throw ctx.throw('Server Error', 500)
    }

    ctx.status = 200
    ctx.body = {
        authToken: token
    }

}

/*
 * Create User with Username and Password
 */
export const createUserPasswordMiddleware: Middleware = async (ctx) => {
    const {username, password} = parseCredsOrThrow(ctx)
    const user = await createUserWithPassword(username, password)
    
    if (isFailure(user)) {
        if(user.cause == Cause.UsernameTaken) {
            throw ctx.throw('Username Taken', 409)
        } else {
            throw ctx.throw('Server Error', 500)
        }
    }

    //Creation Successful
    const token = await getAuthToken(user)
    if (isFailure(token)) {
        throw ctx.throw('Server Error', 500)
    }
    ctx.status = 200
    ctx.body = {
        authToken: token
    }
}


/*
 * Get User Middleware
 */
export const getUserMiddleware: LoggedInMiddleware = async (ctx) => {
    const user = ctx.state.user
    ctx.status = 200
    ctx.body = {
        name: user.getName()
    }
}