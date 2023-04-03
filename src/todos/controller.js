//External Imports
const uuid = require('uuid');

//Internal Imports
const todoModel = require('./model');
const logger = require("../config/logger")("todos-controller");

//fetch todo list
const list = async (req, res) => {
    try {
        let { page, limit, sort = {}, filter = {} } = req.body;
        const options = {
            page: page || 1,
            limit: limit || 10,
            sort,
            select: `userId todoId title status createdAt updatedAt`
        };
        filter.isDeleted = { "$ne": true }
        filter.userId = req.user.userId
        //db call to fetch todos with pagination
        const list = await todoModel.paginate(filter, options);
        res.json({
            ...list,
            page,
            limit
        });
    } catch (error) {
        logger.error(`Error in fetching todo list: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

//create todo
const createTodo = async (req, res) => {
    try {
        var newTodo = req.body;
        newTodo.userId = req.user.userId
        newTodo.todoId = uuid.v4()

        //db call to create todo
        let result = await todoModel.create(newTodo)
        logger.info(`Todo successfully created with id : ${newTodo.todoId}`)
        return res.json(result);
    } catch (error) {
        logger.error(`Error in creating todo : ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

// get todo details
const getTodoDetails = async (req, res) => {
    try {
        const { id } = req.params;

        //db call to get todo details
        let todo = await todoModel.findOne({ todoId: id, isDeleted: false }).lean();
        return res.json(todo);
    } catch (error) {
        logger.error(`Error in fetching todo  details: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

// update todo details of user
const updateTodoDetails = async (req, res) => {
    try {
        let { id } = req.params;
        const { userId } = req.user || {}
        const { status, title } = req.body;

        // db call to get todo details
        let todo = await todoModel.findOne({ todoId: id, userId }).lean();

        //if todo details not fount for requested user then throw error
        if (!todo) throw new error(`todo not found for user`)

        //If there is any change status or title then only update todo
        if ((status && todo.status !== status) || (title && todo.title !== title)) {
            let updateObj = {
                ...status && { status },
                ...title && { title },
                updatedAt: new Date()
            }
            // db call to update todo
            let result = await todoModel.updateOne({ todoId: id, isDeleted: false }, { "$set": updateObj })
            logger.info(`Todo successfully updated with id : ${id}`)
            return res.json(result);
        } else {
            logger.error(`There is no change in todo details for : ${id}`)
            return res.status(200).send({
                message: "No Changes found"
            });
        }
    } catch (error) {
        logger.error(`Error in updating todo  details: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

//delete todo
const deleteTodo = async (req, res) => {
    try {
        let { id } = req.params;

        // db call to delete todo of requested user 
        let result = await todoModel.updateOne({ todoId: id, userId: req.user.userId }, {
            "$set": {
                isDeleted: true,
                deletedAt: new Date()
            }
        });
        logger.info(`Todo successfully deleted with id : ${id}`)
        return res.json(result);
    } catch (error) {
        logger.error(`Error in deleting todo: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
}

module.exports = {
    createTodo,
    list,
    getTodoDetails,
    updateTodoDetails,
    deleteTodo
}