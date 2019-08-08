import {ServerOptions} from 'https'
import {IncomingMessage, ServerResponse, RequestListener} from 'http'
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

type Http2RequestListner = (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void;

interface GreenlockOptions {
    version: 'draft-11' // Let's Encrypt v2
  , store: any
  , server: 'https://acme-staging-v02.api.letsencrypt.org/directory' | 'https://acme-v02.api.letsencrypt.org/directory'
  , email: string
  , agreeTos: true
  , approveDomains: string[]
     , communityMember: boolean
   
  , configDir: string
   
  , debug?: boolean
}

interface Greenlock {
    tlsOptions: ServerOptions,
    middleware: (next?:  Http2RequestListner) => Http2RequestListner
}

declare const index: {
    create: (opts: GreenlockOptions) => Greenlock
};
export = index;
