import * as bcrypt from 'bcrypt'
import Failure, { Cause, isFailure } from '../util/Failure';
import { Nominal } from '../util/Nominal';
import { User, UserID } from './User'
import { sql } from 'slonik';
import DB, { isUniqueIntegrityConstraintViolationError, parseRow } from '../database/Postgres';
import { Success } from '../util/Success';
import { isNull, isUndefined } from '../util/TypeChecking';

const BCRYPT_WORK_FACTOR = 8

export class PasswordHash extends Nominal<string, 'Ping.UserAuth.PasswordHash'>() {

    matches(plainTextPassword: string) {
        return bcrypt.compare(plainTextPassword, PasswordHash.toValue(this))
    }

    static async fromPassword (plainTextPassword: string) {
        const hash = await bcrypt.hash(plainTextPassword, BCRYPT_WORK_FACTOR)
        const a = PasswordHash.fromValue(hash)
        return a
    }

    //Override to validate fromValue
    protected static validate(value: string) {
        if (/^\$2b\$.{56}$/.test(value)){
            return value
        }
        throw Error('[SECURITY ISSUE!] Non-hashed value being used as hash')
    }
}


export async function addPassword(user: User, username: string, plainTextPassword: string) {
    const hash = await PasswordHash.fromPassword(plainTextPassword)
    const res = await DB.maybeOne(addPasswordSQL(user.id, username, hash))
    //Error Handling
    if (isFailure(res)) {
        if (res.cause == Cause.DBError) {
            //Look for specific errors to throw meaningful failures
            
            //Username is already in credentials table
            if (isUniqueIntegrityConstraintViolationError(res.data)) {
                return Failure.create(Cause.UsernameTaken)
            }
        }
        return res
    } else {
        return Success
    }
}

export async function createUserWithPassword(username: string, plainTextPassword: string) {
    const hash = await PasswordHash.fromPassword(plainTextPassword)
    const res = await DB.one(createUserWithPasswordHashSQL(username, hash))
    if (isFailure(res)) {
        //Check for specific errors
        if(res.cause === Cause.DBError) {
            if (isUniqueIntegrityConstraintViolationError(res.data)) {
                return Failure.create(Cause.UsernameTaken)
            }
        }
        return res
    }
    return User.parseUserSQLRow(res)
}

export async function login(username: string, plainTextPassword: string) {
    const res = await DB.maybeOne(loginSQL(username))
    if (isNull(res)) {
        //If username isn't found bad creds
        return Failure.create(Cause.InvalidCredentials)
    }
    if (!isFailure(res)) {
        const hashStr = parseRow(res, 'password_hash')
        const user = User.parseUserSQLRow(res)
        if (!isUndefined(hashStr)) {
            const matches = await PasswordHash.fromValue(hashStr).matches(plainTextPassword)
            if (matches && !isFailure(user)) {
                return user
            } else if (!matches) {
                return Failure.create(Cause.InvalidCredentials)
            }
        }
    }

    return Failure.create(Cause.Unknown)
    
}


//SQL Generators

function loginSQL (username: string) {
    return sql`
        SELECT users.*, cred.bcrypted_pword as password_hash
        FROM user_credentials_password as cred JOIN users
        ON cred.user_id = users.id
        WHERE cred.username=${username}`
}

function addPasswordSQL (userId: UserID, username: string, passwordHash: PasswordHash) {
    return sql`
        INSERT INTO user_credentials_password (username, bcrypted_pword, user_id)
        VALUES (${username}, ${PasswordHash.toValue(passwordHash)}, ${UserID.toValue(userId)})`
}

function createUserWithPasswordHashSQL (username: string, passwordHash: PasswordHash) {
    return sql`
        WITH cur_user AS (
            ${User.Queries.createDefaultUser()}
        ),
        temp AS (
            INSERT INTO user_credentials_password (username, bcrypted_pword, user_id)
            SELECT ${username}, ${PasswordHash.toValue(passwordHash)}, cur_user.id
            FROM cur_user
        )
        SELECT * FROM cur_user`
}