//External Imports
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');

//define post schema
const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            set: (value) => {
                if (typeof value !== 'string') {
                    throw new Error("title must be a string")
                }
                return value;
            }
        },
        body: {
            type: String,
            required: true,
            set: (value) => {
                if (typeof value !== 'string') {
                    throw new Error("body must be a string")
                }
                return value;
            }
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        deletedAt: {
            type: Date
        }
    },
    {
        collection: 'posts',
        timestamps: true
    }
);

postSchema.plugin(paginate);

module.exports = mongoose.model('Posts', postSchema)