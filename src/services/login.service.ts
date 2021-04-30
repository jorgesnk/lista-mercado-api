import UserMongoose, { UserInterface } from '../mongooseSchemas/User.mongoose'
import { AbstractService } from '../middlewares/abstracts/service.abstract'
import { PasswordService } from './password.service'
import { ResponseInterface } from '../interfaces/response.interface'
import { EmailService } from './email.service'

export class ServiceLogin extends AbstractService {
    public async login(email: string, password: string): Promise<ResponseInterface> {
        const passwordService = new PasswordService();
        const returnValue = { name: 1, email: 1, password: 1, birthDate: 1, setPassword: 1 }
        try {
            const getUser = await UserMongoose.user.findOne({ email: email }, returnValue);

            if (!getUser) {
                this.logger.info('user not found')
                return {
                    status: 401,
                    message: 'invalid credentials',
                    error: 'invalid credentials'
                }
            }
            this.logger.info('find user')
            const user = this.compareProperties<UserInterface>(getUser, returnValue);

            const validHash = await passwordService.compareHash(getUser?.password || '', password);
            this.logger.info('compare hash')

            if (!validHash) {
                this.logger.error('invalid hash')
                return {
                    message: 'invalid credentials',
                    status: 401,
                    error: 'invalid credentials'
                }
            }

            const token = passwordService.createToken({ name: user.name, _id: user._id, email: user.email });
            this.logger.info('success to login');
            return {
                message: 'success to login',
                status: 200,
                data: {
                    token,
                    name: user.name,
                    email: user.email,
                    setPassword: user.setPassword
                }
            }

        } catch (e) {
            this.logger.info('erro to login');
            return {
                status: 400,
                message: 'erro to login',
                error: e
            }
        }
    }

    public async lostPassword(email: string): Promise<ResponseInterface> {
        const passwordService = new PasswordService();
        const emailService = new EmailService();
        try {
            const userFind = await UserMongoose.user.findOne({ email: email }, { _id: 1 });
            if (!userFind) {
                return {
                    status: 200,
                    message: 'success to update password',
                    data: { ok: 1 }
                }
            }
            const password = passwordService.createRandomPassword();
            await emailService.sendNewPassword(password, email);

            const hash = await passwordService.createHash(password);

            await UserMongoose.user.updateOne({ _id: userFind._id }, { password: hash, setPassword: true })

            return {
                status: 200,
                message: 'success to update password',
                data: { ok: 1 }
            }

        } catch (e) {
            return {
                error: e,
                message: 'error',
                status: 400,
            }
        }

    }
}