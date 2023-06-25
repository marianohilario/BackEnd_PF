import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = 'products'

const productsSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    owner: {
      type: String,
      default: "Admin",
      required: true,
    },
})

productsSchema.plugin(mongoosePaginate)

export default model(productsCollection, productsSchema)