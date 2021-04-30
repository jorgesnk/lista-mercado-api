import MarketListMongoose from '../mongooseSchemas/MarketList.mongoose';
import { MarketListModel, Product, } from '../models/marketProduct.model'
import HouseMongoose from '../mongooseSchemas/house.mongoose'
import { AbstractService } from '../middlewares/abstracts/service.abstract'
import { ResponseInterface } from '../interfaces/response.interface'
import { Types } from 'mongoose'
export class MarketListService extends AbstractService {


    public async createMarketList(token: string, list: MarketListModel): Promise<ResponseInterface> {

        try {
            const decodeToken = this.decodeJWT(token);

            const validHouse = await this.validateHouse(decodeToken._id, list.house);
            if (!validHouse) {
                return {
                    error: 'invalid house',
                    message: 'invalid house',
                    status: 401
                }
            }

            const createMarketList = await MarketListMongoose.market.create(
                {
                    house: list.house,
                    name: list.name,
                    products: list.products
                }
            )
            this.logger.info('create market list')

            return {
                status: 200,
                data: createMarketList,
                message: 'success created market list'
            }

        } catch (e) {
            this.logger.error(`error to create market list ${e}`);

            return {
                error: e,
                status: 400,
                message: 'erro to create market list'
            }
        }

    }

    public async findMarketList(token: string, houseId: string): Promise<ResponseInterface> {

        try {
            const decodeToken = this.decodeJWT(token);

            const validHouse = await this.validateHouse(decodeToken._id, houseId);
            if (!validHouse) {
                return {
                    error: 'invalid house',
                    message: 'invalid house',
                    status: 401
                }
            }

            const getMarketList = await MarketListMongoose.market.find({ house: houseId }, { _id: 1, name: 1 })
            this.logger.info('find market list')

            return {
                status: 200,
                data: getMarketList,
                message: 'success find market list'
            }

        } catch (e) {
            this.logger.error(`error to find market list ${e}`);

            return {
                error: e,
                status: 400,
                message: 'erro to find market list'
            }
        }

    }

    public async findMarketListById(token: string, houseId: string, marketListId: string): Promise<ResponseInterface> {

        try {
            const decodeToken = this.decodeJWT(token);

            const validHouse = await this.validateHouse(decodeToken._id, houseId);
            if (!validHouse) {
                return {
                    error: 'invalid house',
                    message: 'invalid house',
                    status: 401
                }
            }

            const getMarketList = await MarketListMongoose.market.findOne({ house: houseId, _id: marketListId }, { products: 1 })
            this.logger.info('find market list by id')

            return {
                status: 200,
                data: getMarketList,
                message: 'success find market list by id'
            }

        } catch (e) {
            this.logger.error(`error to find market list by id ${e}`);

            return {
                error: e,
                status: 400,
                message: 'erro to find market list by id'
            }
        }

    }

    private async validateHouse(userId: string, houseId: string): Promise<boolean> {

        try {
            const findHouse = await HouseMongoose.house.findOne({ _id: houseId, 'users._id': userId }, { _id: 1 })
            if (findHouse?._id) {
                this.logger.info('valid house')
                return true;
            }
            this.logger.info('invalid house')

            return false
        } catch (e) {
            this.logger.error('error to validate house');
            throw e;
        }


    }

    public async updateMarketList(token: string, houseId: string, marketListId: string, products: Product[]): Promise<ResponseInterface> {
        try {
            const decodeToken = this.decodeJWT(token);

            const validHouse = await this.validateHouse(decodeToken._id, houseId);
            if (!validHouse) {
                return {
                    error: 'invalid house',
                    message: 'invalid house',
                    status: 401
                }
            }

            const updateProducts = await MarketListMongoose.market.update({ _id: marketListId, house: houseId }, { products });
            this.logger.info(`success update market list`);

            return {
                message: 'success update list',
                status: 200,
                data: updateProducts
            }

        } catch (e) {
            this.logger.error(`error to update market list ${e}`);
            return {
                error: e,
                status: 400,
                message: 'error to update market list'
            }
        }
    }

    public async deleteList(token: string, houseId: string, marketListId: string): Promise<ResponseInterface> {

        try {
            const decodeToken = this.decodeJWT(token);

            const validHouse = await this.validateHouse(decodeToken._id, houseId);
            if (!validHouse) {
                return {
                    error: 'invalid house',
                    message: 'invalid house',
                    status: 401
                }
            }

            const deleteMarketList = await MarketListMongoose.market.remove({ house: houseId, _id: marketListId })
            this.logger.info('delete market list by id')

            return {
                status: 200,
                data: deleteMarketList,
                message: 'success delete market'
            }

        } catch (e) {
            this.logger.error(`error to delete market list ${e}`);

            return {
                error: e,
                status: 400,
                message: 'erro to delete market list'
            }
        }

    }

    public async updateProduct(token: string, houseId: string, marketListId: string, productId: string, product: Product): Promise<ResponseInterface> {
        try {
            const decodeToken = this.decodeJWT(token);


            const validHouse = await this.validateHouse(decodeToken._id, houseId);
            if (!validHouse) {
                return {
                    error: 'invalid house',
                    message: 'invalid house',
                    status: 401
                }
            }

            const keys = Object.keys(product);
            const toSet: any = {};
            const getValue = product as any;
            keys.forEach((value: any) => {
                toSet[`products.$.${value}`] = getValue[value];
            })
            const updateProduct = await MarketListMongoose.market.updateOne({ _id: marketListId, house: houseId, 'products._id': productId },
                {
                    $set: toSet
                }
            );

            this.logger.info(`success update market list`);

            return {
                message: 'success update list',
                status: 200,
                data: updateProduct
            }

        } catch (e) {
            this.logger.error(`error to update market list ${e}`);
            return {
                error: e,
                status: 400,
                message: 'error to update market list'
            }
        }
    }

    public async addProduct(token: string, houseId: string, marketListId: string, product: Product): Promise<ResponseInterface> {
        try {
            const decodeToken = this.decodeJWT(token);


            const validHouse = await this.validateHouse(decodeToken._id, houseId);
            if (!validHouse) {
                return {
                    error: 'invalid house',
                    message: 'invalid house',
                    status: 401
                }
            }

            const id = new Types.ObjectId()
            const productToAdd = {
                ...product, _id: id,
            }

            const updateProduct = await MarketListMongoose.market.updateOne({ _id: marketListId, house: houseId },
                {
                    $push: { products: productToAdd }
                }
            );

            this.logger.info(`success update market list`);

            return {
                message: 'success update list',
                status: 200,
                data: { _id: id, update: updateProduct }
            }

        } catch (e) {
            this.logger.error(`error to update market list ${e}`);
            return {
                error: e,
                status: 400,
                message: 'error to update market list'
            }
        }
    }

    public async removeProduct(token: string, houseId: string, marketListId: string, productId: string): Promise<ResponseInterface> {
        try {
            const decodeToken = this.decodeJWT(token);


            const validHouse = await this.validateHouse(decodeToken._id, houseId);
            if (!validHouse) {
                return {
                    error: 'invalid house',
                    message: 'invalid house',
                    status: 401
                }
            }
            const todDelete: any = { _id: productId }
            const updateProduct = await MarketListMongoose.market.updateOne({ _id: marketListId, house: houseId },
                {
                    $pull: { 'products': todDelete }
                }
            );

            this.logger.info(`success update market list`);

            return {
                message: 'success update list',
                status: 200,
                data: updateProduct
            }

        } catch (e) {
            this.logger.error(`error to update market list ${e}`);
            return {
                error: e,
                status: 400,
                message: 'error to update market list'
            }
        }
    }




}