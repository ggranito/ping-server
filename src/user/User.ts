import { isUndefined } from '../util/TypeChecking'

interface UserInfo {
    name: string
}

export class UserID {
    private id: number
    constructor(id: number){
        this.id = id
    }

    toRaw () : number {
        return this.id
    }
}

export class User {
    id: UserID
    
    constructor (id: UserID) {
        this.id = id
    }

    private info? : UserInfo

    getInfo() : UserInfo {
        if (!isUndefined(this.info)) {
            return this.info
        }
        
        //put db access here
        this.info = {name: "need to access db"}
        return this.info
    }

    getName() {
        return this.getInfo().name
    }
}