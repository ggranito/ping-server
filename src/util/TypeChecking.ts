import {types} from 'util'

export function isObject(value: any): value is object {
    return value !== null && typeof value === 'object'
}

export const isError = types.isNativeError

export function isUndefined(value: any): value is undefined {
    return value === undefined
}

export function isString(value: any): value is string {
    return typeof value === 'string'
}

export function isNull(value: any): value is null {
    return value === null
}

export function isFunction(value: any): value is Function {
    return typeof value === 'function'
}

export const isBuffer = Buffer.isBuffer

export const isArray = Array.isArray

export function isNumber(value: any): value is number {
    return typeof value === 'number'
}

export function isBoolean(value: any): value is boolean {
    return typeof value === 'boolean'
}

export const isDate = types.isDate

export function isPromise (value: any) : value is Promise<any> {
    return types.isPromise(value)
}
