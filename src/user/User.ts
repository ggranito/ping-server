import { isUndefined } from '../util/TypeChecking'
import { Nominal } from '../util/Nominal'
import DB, { parseRow } from '../database/Postgres';
import { sql, QueryResultRowType } from 'slonik';
import { PasswordHash } from './PasswordAuth';
import Failure, { isFailure, Cause } from '../util/Failure';

interface UserInfo {
    firstName?: string
}

export class UserID extends Nominal<string, 'Ping.User.id'>() {}

export class User {

    private info? : UserInfo

    constructor (readonly id: UserID, info?: UserInfo) {
        this.info = info
    }

    getInfo() : UserInfo {
        if (!isUndefined(this.info)) {
            return this.info
        }
        
        //put db access here
        this.info = {firstName: "need to access db"}
        return this.info
    }

    getName() {
        return this.getInfo().firstName
    }

    static async loginUserWithPassword(username: string, plainTextPassword: string) {

    }


    //SQL SPECIFIC

    static Queries = {
        createDefaultUser
    }

    static parseUserSQLRow(sqlRow: QueryResultRowType) : User | Failure<Cause.ParseError> {
        const id = parseRow(sqlRow, 'id');
        if (isUndefined(id)) {
            return Failure.create(Cause.ParseError)
        }
    
        const info = {
            firstName: parseRow(sqlRow, 'first_name')
        }
    
        return new User(UserID.fromValue(id), info)
    }
}

function createDefaultUser () {
    return sql`
            INSERT INTO users
            DEFAULT VALUES
            RETURNING *`
}

