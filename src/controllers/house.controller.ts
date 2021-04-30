import { Request, Response } from 'express'
import { HouseService } from '../services/house.service'
import { JsonSchemaInterface } from '../interfaces/jsonSchema.interface';
import { JsonSchemaTypes, JsonSchemaFormat } from '../enums/jsonSchemas.enum';
import { FactoryController } from '../middlewares/factory/factoryController.middleware'


class HouseController {


    public async create(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        controllerFactory.logger.info('create house')
        const schema: JsonSchemaInterface = {
            additionalProperties: false,
            type: JsonSchemaTypes.OBJECT,
            properties: {
                name: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 2,
                },

            },
            required: ['name']
        }

        try {
            const validate = await controllerFactory.validateSchema(schema, req.body);
            if (validate.valid) {
                const houseService = new HouseService();
                const createHouse = await houseService.create(controllerFactory.getToken(req), req.body.name);
                controllerFactory.responser(resp, createHouse);
                return
            }
            controllerFactory.responseValidateError(resp, validate.error);
        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }

    public async find(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        controllerFactory.logger.info('find house')

        try {
            const houseService = new HouseService();
            const findHouse = await houseService.find(controllerFactory.getToken(req));
            controllerFactory.responser(resp, findHouse);
            return

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }

    public async findById(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        const schema: JsonSchemaInterface = {
            additionalProperties: false,
            type: JsonSchemaTypes.STRING,
        }
        controllerFactory.logger.info('find house by id')
        try {
            const validate = await controllerFactory.validateSchema(schema, req.params.id);
            if (validate.valid) {
                const houseService = new HouseService();
                const findHouse = await houseService.findById(controllerFactory.getToken(req), req.params.id);
                controllerFactory.responser(resp, findHouse);
                return
            }
            controllerFactory.responseValidateError(resp, validate.error);
        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }

    public async addUser(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        controllerFactory.logger.info('add user house')
        const schemaBody: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            additionalProperties: false,
            properties: {
                users: {
                    type: JsonSchemaTypes.ARRAY,
                    items: {
                        type: JsonSchemaTypes.STRING,
                        minLength: 1,
                        format: JsonSchemaFormat.EMAIL
                    },
                    minItems: 1
                }
            },
            required: ['users']

        }
        const schemaParams: JsonSchemaInterface = {
            type: JsonSchemaTypes.STRING,
        }
        try {
            const validateBody = await controllerFactory.validateSchema(schemaBody, req.body);
            const validateParams = await controllerFactory.validateSchema(schemaParams, req.params.houseId);
            if (!validateBody.valid || !validateParams.valid) {
                controllerFactory.logger.error('invalid params to add user')
                controllerFactory.responseValidateError(resp, validateBody.error || validateParams.error)
                return
            }

            const houseService = new HouseService();
            const findHouse = await houseService.addUsers(controllerFactory.getToken(req), req.body.users, req.params.houseId);
            controllerFactory.responser(resp, findHouse);
            return

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }
    }

    public async removeUser(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        controllerFactory.logger.info('remove user house')

        const schemaBody: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            additionalProperties: false,
            properties: {
                users: {
                    type: JsonSchemaTypes.ARRAY,
                    items: {
                        type: JsonSchemaTypes.STRING,
                        minLength: 1,
                    },
                    minItems: 1
                }
            },
            required: ['users']

        }
        const schemaParams: JsonSchemaInterface = {
            type: JsonSchemaTypes.STRING,
        }
        try {
            const validateBody = await controllerFactory.validateSchema(schemaBody, req.body);
            const validateParams = await controllerFactory.validateSchema(schemaParams, req.params.houseId);
            if (!validateBody.valid || !validateParams.valid) {
                controllerFactory.logger.error('invalid params to remove user')
                controllerFactory.responseValidateError(resp, validateBody.error || validateParams.error)
                return
            }

            const houseService = new HouseService();
            const findHouse = await houseService.removeUser(controllerFactory.getToken(req), req.body.users, req.params.houseId);
            controllerFactory.responser(resp, findHouse);
            return

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }
    }

    public async addUserAdmin(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        controllerFactory.logger.info('add user admin house')

        const schemaBody: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            additionalProperties: false,
            properties: {
                user: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 1
                }
            },
            required: ['user']

        }
        const schemaParams: JsonSchemaInterface = {
            type: JsonSchemaTypes.STRING,
        }
        try {
            const validateBody = await controllerFactory.validateSchema(schemaBody, req.body);
            const validateParams = await controllerFactory.validateSchema(schemaParams, req.params.houseId);
            if (!validateBody.valid || !validateParams.valid) {
                controllerFactory.logger.error('invalid params to add user')
                controllerFactory.responseValidateError(resp, validateBody.error || validateParams.error)
                return
            }

            const houseService = new HouseService();
            const findHouse = await houseService.addUsersAdmin(controllerFactory.getToken(req), req.body.user, req.params.houseId);
            controllerFactory.responser(resp, findHouse);
            return

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }
    }

    public async removeUserAdmin(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        controllerFactory.logger.info('remove user admin house')

        const schemaBody: JsonSchemaInterface = {
            type: JsonSchemaTypes.OBJECT,
            additionalProperties: false,
            properties: {
                user: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 1
                }
            },
            required: ['user']

        }
        const schemaParams: JsonSchemaInterface = {
            type: JsonSchemaTypes.STRING,
        }
        try {
            const validateBody = await controllerFactory.validateSchema(schemaBody, req.body);
            const validateParams = await controllerFactory.validateSchema(schemaParams, req.params.houseId);
            if (!validateBody.valid || !validateParams.valid) {
                controllerFactory.logger.error('invalid params to remove user admin user')
                controllerFactory.responseValidateError(resp, validateBody.error || validateParams.error)
                return
            }

            const houseService = new HouseService();
            const findHouse = await houseService.removeUserAdmin(controllerFactory.getToken(req), req.body.user, req.params.houseId);
            controllerFactory.responser(resp, findHouse);
            return

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }
    }

    public async findHouseLevel(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        const schema: JsonSchemaInterface = {
            additionalProperties: false,
            type: JsonSchemaTypes.STRING,
        }
        controllerFactory.logger.info('get house level')
        try {
            const validate = await controllerFactory.validateSchema(schema, req.params.id);
            if (validate.valid) {
                const houseService = new HouseService();
                const findHouse = await houseService.getHouseLevel(controllerFactory.getToken(req), req.params.id);
                controllerFactory.responser(resp, findHouse);
                return
            }
            controllerFactory.responseValidateError(resp, validate.error);
        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }



}

export default new HouseController();


