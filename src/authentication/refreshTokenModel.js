//External Imports
const mongoose = require('mongoose');

// define refresh token schema
const refreshTokenSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }
    },
    {
        collection: 'refresh_tokens',
        timestamps: true
    }
);

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)