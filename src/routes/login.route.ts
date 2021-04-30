import LoginController from '../controllers/login.controller'
import { Router } from 'express'


export class LoginRoute {

    public route = Router();

    constructor() {
        this.route.post('', LoginController.login)
        this.route.post('/password', LoginController.lostPassword)
    }

}

