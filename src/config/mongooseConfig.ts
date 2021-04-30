import mongoose from 'mongoose'

export class MongooseConfig {
    constructor() {
        mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (erro) => {
            if (erro) {
                console.log(`mongoose error`, erro)
            }
        })
    }
}