import { Schema, model, Model, Document, } from 'mongoose';
import { House } from '../models/house.model'
import { ACLLevel } from '../enums/aclLevel.enum'
export interface HouseInterface extends House, Document {
}

class HouseMongooseSchema {

    private houseSchema = new Schema({
        name: { type: String, required: true, minlength: 3 },
        users: [{ _id: { type: Schema.Types.ObjectId, ref: 'User' }, level: { type: String, enum: Object.values(ACLLevel) } }],
    }, { timestamps: true })

    public house: Model<HouseInterface> = model('House', this.houseSchema);

}

export default new HouseMongooseSchema();




