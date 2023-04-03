//External Imports
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
var bcrypt = require('bcrypt');

// define user schema
const userSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        role: {
            type: String,
            required: true,
        },
        hash_password: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: 'users',
        timestamps: true
    }
);

userSchema.methods.comparePassword = function (password, user) {
    return bcrypt.compareSync(password, user.hash_password);
};


userSchema.plugin(paginate);

module.exports = mongoose.model('User', userSchema)