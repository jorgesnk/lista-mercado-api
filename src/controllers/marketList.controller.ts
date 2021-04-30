import { Request, Response } from 'express'
import { MarketListService } from '../services/marketList.service'
import { JsonSchemaInterface } from '../interfaces/jsonSchema.interface';
import { JsonSchemaTypes } from '../enums/jsonSchemas.enum';
import { FactoryController } from '../middlewares/factory/factoryController.middleware'


class MarketListController {

    public async create(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();

        const schema: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            properties: {
                house: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 3,
                },
                name: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 1,
                },
                products: {
                    type: JsonSchemaTypes.ARRAY,
                    items: {
                        type: JsonSchemaTypes.OBJECT,
                        required: ['name', 'unit', 'quantity', 'brand'],
                        properties: {
                            name: { type: JsonSchemaTypes.STRING, minLength: 1 },
                            brand: { type: JsonSchemaTypes.STRING },
                            unit: { type: JsonSchemaTypes.STRING },
                            quantity: { type: JsonSchemaTypes.NUMBER, minimum: 1 }
                        },
                        maxItems: 200,
                    }
                }
            },
            required: ['products', 'name', 'house']
        }
        try {
            const marketListService = new MarketListService();
            const validate = await controllerFactory.validateSchema(schema, req.body);
            if (!validate.valid) {
                controllerFactory.responseValidateError(resp, validate.error);
                return;
            }
            const token = controllerFactory.getToken(req);
            const response = await marketListService.createMarketList(token, req.body)

            resp.status(response.status).send(response)

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    };
    public async get(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();

        const schema: JsonSchemaInterface = {
            type: JsonSchemaTypes.STRING,
            minLength: 3
        }
        try {
            const marketListService = new MarketListService();
            const validate = await controllerFactory.validateSchema(schema, req.params.id);
            if (!validate.valid) {
                controllerFactory.responseValidateError(resp, validate.error);
                return;
            }
            const token = controllerFactory.getToken(req);
            const response = await marketListService.findMarketList(token, req.params.id)

            resp.status(response.status).send(response)

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    };
    public async getById(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();

        const schema: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            properties: {
                houseId: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 3
                },
                marketListId: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 3
                }

            },
            required: ['houseId', 'marketListId']
        }
        try {
            const marketListService = new MarketListService();
            const validate = await controllerFactory.validateSchema(schema, { houseId: req.params.houseId, marketListId: req.params.marketListId });
            if (!validate.valid) {
                controllerFactory.responseValidateError(resp, validate.error);
                return;
            }
            const token = controllerFactory.getToken(req);
            const response = await marketListService.findMarketListById(token, req.params.houseId, req.params.marketListId)

            resp.status(response.status).send(response)

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    };
    public async updateList(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        const schemaParams: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            properties: {
                houseId: {
                    type: JsonSchemaTypes.STRING,
                },
                marketListId: {
                    type: JsonSchemaTypes.STRING,
                }
            },
            required: ['houseId', 'marketListId']
        }
        const schema: JsonSchemaInterface = {
            type: JsonSchemaTypes.ARRAY,
            items: {
                type: JsonSchemaTypes.OBJECT,
                required: ['name', 'unit', 'quantity', 'brand'],
                properties: {
                    name: { type: JsonSchemaTypes.STRING, minLength: 1 },
                    brand: { type: JsonSchemaTypes.STRING },
                    unit: { type: JsonSchemaTypes.STRING },
                    quantity: { type: JsonSchemaTypes.NUMBER, minimum: 1 }
                },
                maxItems: 200,
            }
        }

        try {
            const token = controllerFactory.getToken(req);
            const validateParams = await controllerFactory.validateSchema(schemaParams, {
                marketListId: req.params.marketListId,
                houseId: req.params.houseId
            });
            const validate = await controllerFactory.validateSchema(schema, req.body);

            if (!validate.valid || !validateParams.valid) {
                controllerFactory.responseValidateError(resp, validate.error || validateParams.error);
                return;
            }

            const marketListService = new MarketListService();
            const response = await marketListService.updateMarketList(token, req.params.houseId, req.params.marketListId, req.body)

            resp.status(response.status).send(response)

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }
    };
    public async delete(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();

        const schema: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            properties: {
                houseId: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 3
                },
                marketListId: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 3
                }

            },
            required: ['houseId', 'marketListId']
        }
        try {
            const marketListService = new MarketListService();
            const validate = await controllerFactory.validateSchema(schema, { houseId: req.params.houseId, marketListId: req.params.marketListId });
            if (!validate.valid) {
                controllerFactory.responseValidateError(resp, validate.error);
                return;
            }
            const token = controllerFactory.getToken(req);
            const response = await marketListService.deleteList(token, req.params.houseId, req.params.marketListId)

            resp.status(response.status).send(response)

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    };
    public async updateProduct(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        const schemaParams: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            properties: {
                houseId: {
                    type: JsonSchemaTypes.STRING,
                },
                marketListId: {
                    type: JsonSchemaTypes.STRING,
                },
                productId: {
                    type: JsonSchemaTypes.STRING,
                }
            },
            required: ['houseId', 'marketListId', 'productId']
        }
        const schema: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            properties: {
                name: { type: JsonSchemaTypes.STRING, minLength: 1 },
                brand: { type: JsonSchemaTypes.STRING },
                unit: { type: JsonSchemaTypes.STRING },
                quantity: { type: JsonSchemaTypes.NUMBER, minimum: 1 },
                purchased: { type: JsonSchemaTypes.BOOLEAN },
            },
            additionalProperties: false,
        }

        try {
            const token = controllerFactory.getToken(req);
            const validateParams = await controllerFactory.validateSchema(schemaParams, {
                marketListId: req.params.marketListId,
                houseId: req.params.houseId,
                productId: req.params.productId
            });
            const validate = await controllerFactory.validateSchema(schema, req.body);

            if (!validate.valid || !validateParams.valid) {
                controllerFactory.responseValidateError(resp, validate.error || validateParams.error);
                return;
            }

            const marketListService = new MarketListService();
            const response = await marketListService.updateProduct(token, req.params.houseId, req.params.marketListId, req.params.productId, req.body)

            resp.status(response.status).send(response)

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }
    };
    public async addProduct(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        const schemaParams: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            properties: {
                houseId: {
                    type: JsonSchemaTypes.STRING,
                },
                marketListId: {
                    type: JsonSchemaTypes.STRING,
                },
            },
            required: ['houseId', 'marketListId']
        }
        const schema: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            properties: {
                name: { type: JsonSchemaTypes.STRING, minLength: 1 },
                brand: { type: JsonSchemaTypes.STRING },
                unit: { type: JsonSchemaTypes.STRING },
                quantity: { type: JsonSchemaTypes.NUMBER, minimum: 1 },
            },
            additionalProperties: false,
            required: ['name', 'brand', 'unit', 'quantity']
        }
        try {
            const token = controllerFactory.getToken(req);
            const validateParams = await controllerFactory.validateSchema(schemaParams, {
                marketListId: req.params.marketListId,
                houseId: req.params.houseId,
            });
            const validate = await controllerFactory.validateSchema(schema, req.body);

            if (!validate.valid || !validateParams.valid) {
                controllerFactory.responseValidateError(resp, validate.error || validateParams.error);
                return;
            }

            const marketListService = new MarketListService();
            const response = await marketListService.addProduct(token, req.params.houseId, req.params.marketListId, req.body)

            resp.status(response.status).send(response)

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }
    };
    public async removeProduct(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        const schemaParams: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            properties: {
                houseId: {
                    type: JsonSchemaTypes.STRING,
                },
                marketListId: {
                    type: JsonSchemaTypes.STRING,
                },
                productId: {
                    type: JsonSchemaTypes.STRING,
                }
            },
            required: ['houseId', 'marketListId', 'productId']
        }
        try {
            const token = controllerFactory.getToken(req);
            const validateParams = await controllerFactory.validateSchema(schemaParams, {
                marketListId: req.params.marketListId,
                houseId: req.params.houseId,
                productId: req.params.productId
            });
            if (!validateParams.valid) {
                controllerFactory.responseValidateError(resp, validateParams.error);
                return;
            }
            const marketListService = new MarketListService();
            const response = await marketListService.removeProduct(token, req.params.houseId, req.params.marketListId, req.params.productId)

            resp.status(response.status).send(response)

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }
    };

}

export default new MarketListController();


