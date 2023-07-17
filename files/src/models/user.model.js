import { Schema, model } from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const userCollection = 'usuarios'

const UserSchema = Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age:{
        type:Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
        require: true
    },
    roll:{
        type: String,
        required: true
    },
    carrito: {
         type: Schema.
         Types.ObjectId, 
         ref: "carritos" 
    },
    documents:[
        {
            name: String,
            reference: String
        }
    ],
    last_connection:{
        type: Date
         }
})

UserSchema.pre('find', function(){
    this.populate('cart')
})

UserSchema.plugin(mongoosePaginate)

export default model(userCollection, UserSchema)