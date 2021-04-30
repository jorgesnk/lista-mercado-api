

import { AbstractService } from '../middlewares/abstracts/service.abstract'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { JWTConfig } from '../config/jwtConfig'
export class PasswordService extends AbstractService {

    public createHash(password: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const salt = await this.createSalt();
                bcrypt.hash(password, salt, (err: Error, hash: string) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(hash);
                })
            } catch (e) {
                reject(e);
                this.logger.error(e)
            }
        })
    }

    private createSalt(): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(5, (err: Error, salt: string) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(salt)
            });

        })
    }

    public compareHash(hash: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err: Error, same: boolean) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(same);
            })
        })
    }

    public createToken(data: { email: string, _id: string, name: string }) {
        const jwtConfig = new JWTConfig();
        return sign(data, jwtConfig.secret, { algorithm: 'HS256' })
    }

    public createRandomPassword(): string {
        const values = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a',
            'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
            'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
            'x', 'z'
        ]
        let random = '';

        for (let i = 0; i < 6; i++) {
            const value = Math.floor(Math.random() * values.length)
            random = random.concat(values[value]);
        }

        return random;

    }


} 