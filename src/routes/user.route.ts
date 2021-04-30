import UserController from '../controllers/user.controller'
import { Router } from 'express'




export class UserRouter {

    public route = Router();

    constructor() {
        this.route.post('/create', UserController.create)
        this.route.get('', UserController.findProfile)
        this.route.put('', UserController.updateProfile)
        this.route.put('/password', UserController.updatePassword)
    }

}

