import { Schema, model, Model, Document, } from 'mongoose';
import { User } from '../models/User.model'

export interface UserInterface extends User, Document {
}

class UserMongooseSchema {

    private userSchema = new Schema({
        name: { type: String, required: true, minlength: 3 },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        birthDate: { type: Date, required: true },
        setPassword: { type: Boolean, default: false }
    }, { timestamps: true })

    public user: Model<UserInterface> = model('User', this.userSchema);

}

export default new UserMongooseSchema();




