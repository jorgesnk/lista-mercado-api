import { Schema, model, Model, Document, } from 'mongoose';
import { MarketListModel } from '../models/marketProduct.model'
export interface MarketListInterface extends MarketListModel, Document {
}

class HouseMongooseSchema {
    private productSchema = new Schema({
        name: { type: String, required: true, minlength: 1 },
        quantity: { type: Number, required: true, min: 1 },
        unit: { type: String, },
        brand: { type: String, },
        purchased: { type: Boolean, default: false, required: true }

    }, { timestamps: true })

    private marketListSchema = new Schema({
        name: { type: String, required: true, minlength: 1 },
        house: { type: Schema.Types.ObjectId },
        products: [this.productSchema]
    }, { timestamps: true })

    public market: Model<MarketListInterface> = model('MarketList', this.marketListSchema);

}

export default new HouseMongooseSchema();




