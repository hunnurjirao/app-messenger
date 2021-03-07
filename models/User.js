const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');


const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    },
    confirmPassword: {
        type: String,
        required: [true, "password doesn't match"]

    }
})

UserSchema.plugin(uniqueValidator);


UserSchema.pre('save', async function (next) {
    const user = this
    user.password = await bcrypt.hash(user.password, 10)
    user.confirmPassword = await bcrypt.hash(user.confirmPassword, 10)

    next()
})


const User = mongoose.model('User', UserSchema);

module.exports = User;