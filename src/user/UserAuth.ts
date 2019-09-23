import * as bcrypt from 'bcrypt'
import Failure, { Cause } from '../util/Failure';

class PasswordHash {

    constructor(private readonly hashString: string) {}

    toString() : string {
        return this.hashString
    }

    static async create(password: string) : Promise<PasswordHash | Failure<Cause.InvalidPassword>>{
        
        
    }
}

function createCredentials(password: string)


function login(username: string, password: string) {
    //db query to get hash
    const hash = "TODO"
    
    bcrypt.hash()
}