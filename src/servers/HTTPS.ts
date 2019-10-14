import * as https from 'https'
import * as http from 'http'
import * as koa from 'koa';
import * as koaGreenlock from 'greenlock-koa'
import * as os from 'os';
import * as greenlockStoreFS from 'greenlock-store-fs'

const getGreenlock = () => {
    return koaGreenlock.create({
        version: 'draft-11' // Let's Encrypt v2
      , store: greenlockStoreFS
        // You MUST change this to 'https://acme-v02.api.letsencrypt.org/directory' in production
      , server: "https://acme-v02.api.letsencrypt.org/directory"
       
      , email: 'gregory.granito@gmail.com'
      , agreeTos: true
      , approveDomains: [ 'ggranito.com' ]
       
        // Join the community to get notified of important updates
        // and help make greenlock better
      , communityMember: true
       
      , configDir: os.homedir() + '/acme/etc'
       
      //, debug: true
      });
}

export const startHttpsServer = (app: koa<any, any>) => {

    const greenlock = getGreenlock();
    // https server
    var server = https.createServer(greenlock.tlsOptions, greenlock.middleware(app.callback()));

    server.listen(443, function () {
        console.log('Listening at https://localhost:' + 443);
    });

    // http redirect to https
    http.createServer(greenlock.middleware()).listen(80, function () {
        console.log('Listening on port 80 to handle ACME http-01 challenge and redirect to https');
    });
}