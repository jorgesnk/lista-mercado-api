import { Request, Response } from 'express'
import { ServiceLogin } from '../services/login.service'
import { JsonSchemaInterface } from '../interfaces/jsonSchema.interface';
import { JsonSchemaTypes, JsonSchemaFormat } from '../enums/jsonSchemas.enum';
import { FactoryController } from '../middlewares/factory/factoryController.middleware'


class LoginController {


    public async login(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();

        const schema: JsonSchemaInterface = {
            additionalProperties: false,
            type: JsonSchemaTypes.OBJECT,
            properties: {
                email: {
                    type: JsonSchemaTypes.STRING,
                    format: JsonSchemaFormat.EMAIL
                },
                password: {
                    type: JsonSchemaTypes.STRING,
                    minLength: 6,
                },

            },
            required: ['email', 'password']
        }

        try {
            const validate = await controllerFactory.validateSchema(schema, req.body);
            if (validate.valid) {
                const loginService = new ServiceLogin();
                const login = await loginService.login(req.body.email, req.body.password);
                controllerFactory.responser(resp, login);
                return
            }
            controllerFactory.responseValidateError(resp, validate.error);
        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }
    public async lostPassword(req: Request, resp: Response) {
        const controllerFactory = new FactoryController();

        const schema: JsonSchemaInterface = {
            additionalProperties: false,
            type: JsonSchemaTypes.OBJECT,
            properties: {
                email: {
                    type: JsonSchemaTypes.STRING,
                    format: JsonSchemaFormat.EMAIL
                },
            },
            required: ['email']
        }

        try {
            const validate = await controllerFactory.validateSchema(schema, req.body);
            if (validate.valid) {
                const loginService = new ServiceLogin();
                const setPassword = await loginService.lostPassword(req.body.email);
                controllerFactory.responser(resp, setPassword);
                return
            }
            controllerFactory.responseValidateError(resp, validate.error);
        } catch (e) {
            controllerFactory.responseValidateError(resp, e);
            controllerFactory.logger.error(e);
        }

    }

}

export default new LoginController();


