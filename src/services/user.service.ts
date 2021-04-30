
import { User } from '../models/User.model'
import UserMongoose from '../mongooseSchemas/User.mongoose'
import { AbstractService } from '../middlewares/abstracts/service.abstract'
import { PasswordService } from './password.service'
import { ResponseInterface } from '../interfaces/response.interface'
import { EmailService } from './email.service'
export class UserService extends AbstractService {
    public async createUse(user: User): Promise<ResponseInterface> {
        try {
            const passwordService = new PasswordService();
            const hash = await passwordService.createHash(user.password);
            this.logger.info('created hash');
            user.password = hash;
            const userCreate = await UserMongoose.user.create(user);
            this.logger.info('user created')
            const token = passwordService.createToken({ _id: userCreate._id, name: user.name, email: user.email });
            return {
                message: 'success to create',
                status: 200,
                data: {
                    token,
                    name: user.name,
                    email: user.email
                }
            }
        } catch (e) {
            this.logger.error(e);
            return {
                status: 500,
                message: 'erro to create user',
                error: e
            }
        }

    }

    public async getProfileData(token: string): Promise<ResponseInterface> {
        try {
            const _id = this.decodeJWT(token)._id;
            const user = await UserMongoose.user.findById(_id, { password: 0 });

            return {
                data: user,
                status: 200,
                message: "success to find user"
            }

        } catch (e) {
            return {
                error: e,
                status: 400,
                message: "error to find user"
            }
        }
    }

    public async setProfileData(user: { name: string, birthDate?: Date }, token: string): Promise<ResponseInterface> {
        try {
            const _id = this.decodeJWT(token)._id;
            const updateUser = await UserMongoose.user.updateOne({ _id: _id }, user);
            return {
                data: updateUser,
                message: "success to update",
                status: 200
            }
        } catch (e) {
            return { message: 'error to set user profile', status: 400, error: e }
        }
    }

    public async setPassword(newPassword: string, oldPassword: string, token: string): Promise<ResponseInterface> {
        try {
            const emailService = new EmailService();
            const _id = this.decodeJWT(token)._id;
            const passwordService = new PasswordService();
            const userFind = await UserMongoose.user.findById(_id, { password: 1, email: 1 });
            if (!userFind) {
                return {
                    error: "not find user",
                    status: 404,
                    message: "error to find user"
                }
            }
            const compare = await passwordService.compareHash(userFind.password, oldPassword);
            if (!compare) {
                return {
                    error: 'invalid password',
                    message: 'error to update password',
                    status: 400
                }
            }
            const hash = await passwordService.createHash(newPassword);

            const update = await UserMongoose.user.updateOne({ _id: _id }, { password: hash })
            emailService.notifyNewPassword(userFind.email);
            return {
                data: update,
                status: 200,
                message: 'success to update password'
            }
        } catch (e) {
            return {
                error: e,
                message: 'error to update password',
                status: 400
            }
        }
    }


}

