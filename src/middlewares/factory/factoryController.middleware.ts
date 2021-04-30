
import Ajv from 'ajv';
import Logger from '../logger/logger'
import { JsonSchemaInterface } from '../../interfaces/jsonSchema.interface'
import { Response, Request } from 'express'
import { ResponseInterface } from '../../interfaces/response.interface'
export class FactoryController {
    public logger = Logger;
    public async validateSchema(schema: JsonSchemaInterface, data: any): Promise<{ valid: boolean, error?: string }> {
        var ajv = new Ajv();
        var validate = ajv.compile(schema);
        var valid = await validate(data);
        if (!valid) {
            return {
                valid,
                error: JSON.stringify(validate.errors)
            }
        }
        return { valid };
    }
    public responser(resp: Response, data: ResponseInterface) {
        resp.status(data.status).send(data);
    }

    public responseValidateError(resp: Response, error: string | undefined) {

        resp.status(400).send({ message: 'invalid params', error: error ? error : '' });
    }

    public getToken(req: Request): string {
        return req.headers.authorization || ''
    }

}