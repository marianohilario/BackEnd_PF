import { Schema, model } from 'mongoose'

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
    role:{
        type: String,
        required: true
    }
})

UserSchema.pre('find', function(){
    this.populate('cart')
})

export default model(userCollection, UserSchema)