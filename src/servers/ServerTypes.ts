import { User } from "../user/User"
import * as koa from 'koa'
import { IRouterParamContext } from "koa-router"
import * as compose from 'koa-compose'

//Types for all of the middleware
type AuthedContext = {
    state: {
        user: User
    }
}

export type BaseState = {}
export type BaseContext = koa.ParameterizedContext<BaseState>
export type RouterContext = BaseContext & IRouterParamContext<BaseContext, {}>
export type LoggedInContext = BaseContext & AuthedContext
export type Middleware<T extends BaseContext = BaseContext> = compose.Middleware<T>
export type LoggedInMiddleware = Middleware<LoggedInContext>
