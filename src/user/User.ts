import { isUndefined } from "util";


export type UserID = number
interface UserInfo {
    name: string
}


class User {
    id: UserID
    
    constructor (id: UserID) {
        this.id = id
    }

    private info? : UserInfo

    private getInfo() : UserInfo {
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