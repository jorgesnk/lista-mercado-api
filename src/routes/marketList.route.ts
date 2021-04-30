import MarketListController from '../controllers/marketList.controller'
import { Router } from 'express'
import marketListController from '../controllers/marketList.controller';


export class MarketListRoute {

    public route = Router();

    constructor() {
        this.route.post('', MarketListController.create)
        this.route.get('/:houseId/:marketListId', MarketListController.getById)
        this.route.delete('/:houseId/:marketListId', MarketListController.delete)
        this.route.get('/:id', MarketListController.get)
        this.route.put('/list/:marketListId/:houseId/:productId', marketListController.updateProduct)
        this.route.post('/list/:marketListId/:houseId', marketListController.addProduct)
        this.route.delete('/list/:marketListId/:houseId/:productId', marketListController.removeProduct)
    }

}

