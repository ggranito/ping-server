//setup process.env vars
import * as dotenv from 'dotenv'
let res = dotenv.config()
if (!isUndefined(res.error)) {
    throw res.error
}

//Start server
import * as Server from './servers/Server'
import { isUndefined } from './util/TypeChecking';
Server.startServers();
