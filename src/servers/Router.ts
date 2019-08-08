import * as KoaRouter from 'koa-router'
import WSS from './WSS'

const router = new KoaRouter()
router.get("/new_call", WSS.newSocketMiddleware(() => null));


export const routes = router.routes()