//External Imports
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');

//define comments schema
const commentSchema = mongoose.Schema(
    {
        postId: {
            type: String,
            required: true
        },
        commentId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true,
            set: (value) => {
                if (typeof value !== 'string') {
                    throw new Error("comment must be a string")
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
        },
    },
    {
        collection: 'comments',
        timestamps: true
    }
);

commentSchema.plugin(paginate);

module.exports = mongoose.model('Comments', commentSchema)