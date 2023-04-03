//External Imports
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');

// define todo schema
const todoSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        todoId: {
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
        status: {
            type: String,
            // enums: ['pending', 'inprocess', "completed"],
            default: 'pending',
            set: (value) => {
                if (!['pending', 'inprocess', "completed"].includes(value)) {
                    throw new Error("status must be valid")
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
        collection: 'todos',
        timestamps: true
    }
);

todoSchema.plugin(paginate);

module.exports = mongoose.model('Todos', todoSchema)