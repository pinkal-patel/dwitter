//External Imports
const uuid = require('uuid');

//Internal Imports
const commentsModel = require('./model');
const logger = require("../config/logger")("comments-controller");

// fetch the list of comments of the post
const list = async (req, res) => {
    try {
        let { postId } = req.params;
        let { page, limit, sort = {}, filter = {} } = req.body;
        const options = {
            page: page || 1,
            limit: limit || 10,
            sort,
            select: `postId commentId name body createdAt updatedAt`
        };
        filter.postId = postId;
        filter.isDeleted = { "$ne": true }
        // db call to fetch the comments with pagination
        const list = await commentsModel.paginate(filter, options);
        res.json({
            ...list,
            page,
            limit
        });
    } catch (error) {
        logger.error(`Error in fetching comments: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

//create the comments on the post
const createComment = async (req, res) => {
    try {
        let { postId } = req.params;
        var newComment = req.body;
        newComment.postId = postId
        newComment.userId = req.user.userId
        newComment.name = req.user.userName
        newComment.commentId = uuid.v4()

        //db call to create new comment
        await commentsModel.create(newComment)
        logger.info(`comment successfully created with id : ${newComment.commentId}`)
        return res.json(newComment);
    } catch (error) {
        logger.error(`Error in creating comment: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

//edit the user comments of the post
const updateCommentDetails = async (req, res) => {
    try {
        let { id } = req.params;
        let { userId } = req.user || {}
        const { body } = req.body;

        // to check if comment exists
        let commentDetails = await commentsModel.findOne({ commentId: id, userId }).lean();
        if (!commentDetails) throw new Error("Comments not found for the user")

        //check is there any change in comments then only update the comment
        if (commentDetails && body && commentDetails.body !== body) {
            let updateObj = {
                body,
                updatedAt: new Date()
            }
            //db call to edit the comment
            let resp = await commentsModel.updateOne({ commentId: id, isDeleted: false }, { "$set": updateObj })
            logger.info(`comment successfully updated with id : ${id}`)
            return res.json(resp);
        } else {
            logger.error(`There is no change in comment details for : ${id}`)
            return res.status(200).send({
                message: "No Changes found"
            });
        }
    } catch (error) {
        logger.error(`Error in updating the comment: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

//delete the comment
const deleteComments = async (req, res) => {
    try {
        let { id } = req.params;
        let { userId } = req.user || {}
        // db call to delete the comment of the user
        let resp = await commentsModel.updateOne({ commentId: id, userId }, {
            "$set": {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
        logger.info(`Post successfully deleted with id : ${id}`)
        return res.json(resp);
    } catch (error) {
        logger.error(`Error in deleting the comment: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
}

module.exports = {
    createComment,
    list,
    updateCommentDetails,
    deleteComments
}