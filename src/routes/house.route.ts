import HouseController from '../controllers/house.controller'
import { Router } from 'express'


export class HouseRoute {

    public route = Router();

    constructor() {
        this.route.post('', HouseController.create)
        this.route.get('', HouseController.find)
        this.route.get('/:id', HouseController.findById)
        this.route.put('/users/remove/admin/:houseId', HouseController.removeUserAdmin)
        this.route.put('/users/add/admin/:houseId', HouseController.addUserAdmin)
        this.route.put('/users/add/:houseId', HouseController.addUser)
        this.route.put('/users/remove/:houseId', HouseController.removeUser)
        this.route.get('/users/level/:id', HouseController.findHouseLevel)

    }

}

