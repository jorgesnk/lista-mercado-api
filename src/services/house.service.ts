import HouseMongoose from '../mongooseSchemas/house.mongoose'
import { AbstractService } from '../middlewares/abstracts/service.abstract'
import { ResponseInterface } from '../interfaces/response.interface'
import UserMongoose from '../mongooseSchemas/User.mongoose'
import { ACLLevel } from '../enums/aclLevel.enum';
export class HouseService extends AbstractService {

    public async create(token: string, nameHouse: string): Promise<ResponseInterface> {
        try {
            const dataToken = this.decodeJWT(token);
            const createdHouse = await HouseMongoose.house.create({ name: nameHouse, users: [{ _id: dataToken._id, level: ACLLevel.ADMIN }], marketList: [] });
            this.logger.info('created house');
            return {
                status: 200,
                message: 'created house',
                data: {
                    _id: await createdHouse._id
                }
            }
        } catch (e) {
            this.logger.error(e);
            return {
                status: 500,
                message: 'error to create house',
                error: e
            }
        }



    }

    public async find(token: string): Promise<ResponseInterface> {
        try {
            const dataToken = this.decodeJWT(token);
            const findHouse = await HouseMongoose.house.find({ 'users._id': dataToken._id }, { _id: 1, name: 1 })
            this.logger.info('find house');
            return {
                status: 200,
                message: 'find house',
                data: {
                    houses: findHouse
                }
            }
        } catch (e) {
            this.logger.error(e);
            return {
                status: 500,
                message: 'error to find house',
                error: e
            }
        }
    }

    public async addUsers(token: string, users: string[], houseId: string): Promise<ResponseInterface> {
        try {
            const dataToken = this.decodeJWT(token);

            const access = await this.acl.isValidAccess(dataToken._id, houseId, ACLLevel.ADMIN);

            if (!access) {
                return this.responseForbidden();
            }

            const findUsers = await UserMongoose.user.find({ email: { $in: users } }, { _id: 1 });

            if (findUsers.length !== users.length) {
                this.logger.error('user not found')
                return {
                    status: 400,
                    message: 'user not found',
                    error: 'user not found'
                }
            }

            const mapUsers = findUsers.map((userMap) => ({ _id: userMap._id, level: ACLLevel.USER }));

            const addUser = await HouseMongoose.house.update({
                _id: houseId, $and: [
                    { 'users._id': { $not: { $in: mapUsers.map((elementUser) => elementUser._id) } } }
                ]
            }, { $push: { users: { $each: mapUsers } } })

            return {
                message: 'success to add user',
                status: 200,
                data: addUser
            }

        } catch (e) {
            this.logger.error(`erro to update house ${e}`)
            return {
                error: e,
                status: 500,
                message: 'erro to update house'
            }
        }

    }

    public async removeUser(token: string, users: string[], houseId: string): Promise<ResponseInterface> {
        try {

            const decodeToken = this.decodeJWT(token);

            const access = await this.acl.isValidAccess(decodeToken._id, houseId, ACLLevel.ADMIN);

            if (!access) {
                return this.responseForbidden();
            }

            const findSelf = users.find((elementUser) => elementUser === decodeToken._id);

            if (findSelf) {
                this.logger.error('cant self remove')
                return {
                    status: 400,
                    message: 'cant self remove',
                    error: 'cant self remove'
                }
            }

            const updateHouse = await HouseMongoose.house.update({ _id: houseId }, { $pull: { users: { _id: { $in: users } } } })
            this.logger.info('update house remove user')

            return {
                message: 'success to remove user',
                status: 200,
                data: updateHouse
            }
        } catch (e) {
            this.logger.error(`erro to update house remove user ${e}`)
            return {
                error: e,
                status: 500,
                message: 'erro to update house'
            }
        }
    }

    public async addUsersAdmin(token: string, user: string, houseId: string): Promise<ResponseInterface> {
        try {

            const decodeToken = this.decodeJWT(token);

            const access = await this.acl.isValidAccess(decodeToken._id, houseId, ACLLevel.ADMIN);

            if (!access) {
                return this.responseForbidden();
            }

            const updateHouseUser = await HouseMongoose.house.update({
                _id: houseId,
                users: { _id: decodeToken._id, level: ACLLevel.ADMIN }, 'users._id': user
            }, {
                $set: { [`users.$.level`]: ACLLevel.ADMIN },
                $arrayFilters: [{ _id: user }]
            });

            return {
                message: 'success to add user admin',
                status: 200,
                data: updateHouseUser
            }

        } catch (e) {
            this.logger.error(`erro to update house ${e}`)
            return {
                error: e,
                status: 500,
                message: 'erro to update house'
            }
        }

    }

    public async removeUserAdmin(token: string, user: string, houseId: string): Promise<ResponseInterface> {
        try {

            const decodeToken = this.decodeJWT(token);

            const access = await this.acl.isValidAccess(decodeToken._id, houseId, ACLLevel.ADMIN);

            if (!access) {
                return this.responseForbidden();
            }

            if (user === decodeToken._id) {
                this.logger.error('cant self remove')
                return {
                    status: 400,
                    message: 'cant self remove',
                    error: 'cant self remove'
                }
            }

            const updateHouseUser = await HouseMongoose.house.update({
                _id: houseId,
                users: { _id: decodeToken._id, level: ACLLevel.ADMIN }, 'users._id': user
            }, {
                $set: { [`users.$.level`]: ACLLevel.USER },
                $arrayFilters: [{ _id: user }]
            });

            this.logger.info('update house remove user')

            return {
                message: 'success to remove user',
                status: 200,
                data: updateHouseUser
            }
        } catch (e) {
            this.logger.error(`erro to update house remove user ${e}`)
            return {
                error: e,
                status: 500,
                message: 'erro to update house'
            }
        }
    }

    public async findById(token: string, houseId: string): Promise<ResponseInterface> {
        try {
            const dataToken = this.decodeJWT(token);
            const findHouse = await HouseMongoose.house.findOne({ _id: houseId, 'users._id': dataToken._id }).populate('users._id', 'name email')
            this.logger.info('find house');
            return {
                status: 200,
                message: 'find house',
                data: {
                    house: findHouse
                }
            }
        } catch (e) {
            this.logger.error(e);
            return {
                status: 500,
                message: 'error to find house',
                error: e
            }
        }
    }

    public async getHouseLevel(token: string, houseId: string): Promise<ResponseInterface> {
        try {
            const dataToken = this.decodeJWT(token);
            const findHouse = await HouseMongoose.house.findOne({ _id: houseId, 'users._id': dataToken._id }, { 'users.$.level': 1 });
            this.logger.info('find house');
            return {
                status: 200,
                message: 'find userLevel',
                data: {
                    level: findHouse?.users[0].level
                }
            }
        } catch (e) {
            this.logger.error(e);
            return {
                status: 500,
                message: 'error to find user level',
                error: e
            }
        }
    }

}