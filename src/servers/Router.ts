import * as KoaRouter from 'koa-router'
import WSS from './WSS'
import { BaseState } from './ServerTypes';
import { authenticateJWT } from '../auth/JWT';
import { getUserMiddleware, loginPasswordMiddleware} from '../user/UserMiddleware';

const router = new KoaRouter<BaseState>()
router.get("/new_call", authenticateJWT(WSS.newSocketMiddleware(() => null)));
router.get("/user", authenticateJWT(getUserMiddleware))
router.post("/user/login/password", loginPasswordMiddleware)


export const routes = router.routes()