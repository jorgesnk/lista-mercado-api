
import Logger from '../logger/logger'
import jsonwebtoken from 'jsonwebtoken'
import { ACL } from '../ACL/ACL'
import { ResponseInterface } from '../../interfaces/response.interface'
export abstract class AbstractService {
    protected logger = Logger;

    protected acl = new ACL();

    protected compareProperties<T>(data: any, compare: { [key: string]: number }): T {
        const compareToArray: string[] = Object.keys(compare);
        compareToArray.forEach((element: string) => {
            if (compare[element] === 1 && (data[element] === null || data[element] === undefined)) {
                throw new Error('params not valid');
            }
        })
        return data;
    }

    protected decodeJWT(token: string): { _id: string, name: string, email: string } {
        const decode: any = jsonwebtoken.decode(token.replace('Bearer ', ''));
        this.compareProperties(decode, { name: 1, _id: 1, email: 1 })
        return {
            name: decode.name,
            _id: decode._id,
            email: decode.email,
        }
    }

    protected responseForbidden(): ResponseInterface {
        this.logger.error('invalid access')
        return {
            status: 403,
            message: 'invalid access',
            error: 'invalid access'
        }
    }

}