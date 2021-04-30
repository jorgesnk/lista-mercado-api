import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { JsonSchemaInterface } from '../interfaces/jsonSchema.interface';
import { JsonSchemaTypes, JsonSchemaFormat } from '../enums/jsonSchemas.enum';
import { FactoryController } from '../middlewares/factory/factoryController.middleware'


class UserController {


    public async create(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();
        const schema: JsonSchemaInterface = {
            additionalProperties: false,
            type: JsonSchemaTypes.OBJECT,
            properties: {
                name: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 3
                },
                email: {
                    type: JsonSchemaTypes.STRING,
                    format: JsonSchemaFormat.EMAIL
                },
                password: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 6,
                },
                birthDate: {
                    type: JsonSchemaTypes.STRING,
                    format: JsonSchemaFormat.DATE_TIME
                },
            },
            required: ['name', 'email', 'password']

        }
        try {
            const validate = await controllerFactory.validateSchema(schema, req.body);
            if (validate.valid) {
                const userService = new UserService();
                const createdUser = await userService.createUse(req.body);
                controllerFactory.responser(resp, createdUser);
                return
            }
            controllerFactory.responseValidateError(resp, validate.error);
        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }
    public async findProfile(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();

        try {
            const token = controllerFactory.getToken(req);
            const userService = new UserService();
            const findProfile = await userService.getProfileData(token);
            controllerFactory.responser(resp, findProfile);
            return

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }
    public async updateProfile(req: Request, resp: Response) {

        const schema: JsonSchemaInterface = {
            additionalProperties: false,
            type: JsonSchemaTypes.OBJECT,
            properties: {
                name: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 3
                },
                birthDate: {
                    type: JsonSchemaTypes.STRING,
                    format: JsonSchemaFormat.DATE_TIME
                },
            },
            required: ['name']

        }
        const controllerFactory = new FactoryController();
        try {

            const validateSchema = await controllerFactory.validateSchema(schema, req.body)
            if (!validateSchema.valid) {
                controllerFactory.responseValidateError(resp, validateSchema.error)
                return
            }
            const token = controllerFactory.getToken(req);
            const userService = new UserService();
            const setProfile = await userService.setProfileData(req.body, token);
            controllerFactory.responser(resp, setProfile);
            return

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }
    public async updatePassword(req: Request, resp: Response) {

        const schema: JsonSchemaInterface = {
            additionalProperties: false,
            type: JsonSchemaTypes.OBJECT,
            properties: {
                newPassword: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 6
                },
                oldPassword: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 6
                },
            },
            required: ['newPassword', 'oldPassword']

        }

        const controllerFactory = new FactoryController();
        try {

            const validateSchema = await controllerFactory.validateSchema(schema, req.body)
            if (!validateSchema.valid) {
                controllerFactory.responseValidateError(resp, validateSchema.error)
                return
            }
            const token = controllerFactory.getToken(req);
            const userService = new UserService();
            const setPassword = await userService.setPassword(req.body.newPassword, req.body.oldPassword, token);
            controllerFactory.responser(resp, setPassword);
            return

        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }

}

export default new UserController();


