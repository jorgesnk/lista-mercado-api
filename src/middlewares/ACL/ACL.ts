import { ACLLevel } from "../../enums/aclLevel.enum"
import HouseMongoose from '../../mongooseSchemas/house.mongoose'
export class ACL {


    public async isValidAccess(userId: string, houseId: string, level: ACLLevel): Promise<boolean> {

        try {
            const find = await HouseMongoose.house.findOne({ _id: houseId, 'users._id': userId }, { 'users.$.level': 1 })
            if (!find) {
                return false;
            }
            return find.users.find((value) => value._id.toString() === userId.toString())?.level === level;
        } catch (e) {
            throw new Error(e)
        }

    }

}