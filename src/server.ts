import express from 'express';
import ExpressJwt from 'express-jwt';
import { JWTConfig } from './config/jwtConfig';
import helmet from 'helmet';
import { ServerConfig } from './config/serverConfig'
import Logger from './middlewares/logger/logger'
import { MongooseConfig } from './config/mongooseConfig'
import { UserRouter } from './routes/user.route'
import { LoginRoute } from './routes/login.route'
import { HouseRoute } from './routes/house.route'
import { MarketListRoute } from './routes/marketList.route'
export class Server {

    constructor() {
        this.middleware();
        this.run()
    }

    private app = express();

    private middleware() {
        this.configJWT();
        this.app.use(express.json());
        this.app.use(helmet());
        this.loadRouters()
    }

    private configJWT() {
        const jwtConfig = new JWTConfig();
        this.app.use(ExpressJwt({ secret: jwtConfig.secret, algorithms: [jwtConfig.algorithm] }).unless({
            path: [,
                '/user/create',
                '/login', 
                '/login/password']
        }));
    }

    private run() {
        const serverConfig = new ServerConfig();
        this.app.listen(serverConfig.port, () => {
            new MongooseConfig();
            Logger.info(`server start ${serverConfig.port}`)
        })
    }

    private loadRouters() {
        this.app.use('/user', new UserRouter().route)
        this.app.use('/login', new LoginRoute().route)
        this.app.use('/house', new HouseRoute().route)
        this.app.use('/marketList', new MarketListRoute().route)
    }


}