//External Imports
const uuid = require('uuid');

//Internal Imports
const postModel = require('./model');
const logger = require("../config/logger")("posts-controller");

// fetch posts
const list = async (req, res) => {
    try {
        let { page, limit, sort = {}, filter = {} } = req.body;
        const options = {
            page: page || 1,
            limit: limit || 10,
            sort,
            select: `userId postId title body createdAt updatedAt`
        };
        filter.isDeleted = { "$ne": true }
        //db call to fetch posts with pagination
        const list = await postModel.paginate(filter, options);
        res.json({
            ...list,
            page,
            limit
        });
    } catch (error) {
        logger.error(`Error in fetching posts list: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

//create new post
const createPost = async (req, res) => {
    try {
        var newPost = req.body;
        newPost.postId = uuid.v4()
        newPost.userId = req.user.userId

        // db call to create new post for a user
        await postModel.create(newPost)
        logger.info(`Post successfully created with id : ${newPost.postId}`)
        return res.json(newPost);
    } catch (error) {
        logger.error(`Error in creating post: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

// get post details
const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        // db call to get post details
        let post = await postModel.findOne({ postId: id }).lean();
        return res.json(post);
    } catch (error) {
        logger.error(`Error in fetching post details: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

// edit post details of user
const updatePostDetails = async (req, res) => {
    try {
        let { id } = req.params;
        const { userId } = req.user || {}
        const { body, title } = req.body;

        // check if post exists
        let post = await postModel.findOne({ postId: id, userId }).lean();
        // if post not exists then throw error
        if (!post) throw new error(`todo not found for user`)

        //check is there any change in body or title then only update the post
        if ((body && post.body !== body) || (title && post.title !== title)) {
            let updateObj = {
                ...body && { body },
                ...title && { title },
                updatedAt: new Date()
            }
            // db call to update post details
            let result = await postModel.updateOne({ postId: id, isDeleted: false }, { "$set": updateObj })
            logger.info(`Post successfully updated with id : ${id}`)
            return res.json(result);
        } else {
            logger.error(`There is no change in post details for : ${id}`)
            return res.status(200).send({
                message: "No Changes found"
            });
        }
    } catch (error) {
        logger.error(`Error in updating post details: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

//delete the post
const deletePost = async (req, res) => {
    try {
        let { id } = req.params;
        const { userId } = req.user || {}
        // db call to delete the post of the user
        let todo = await postModel.updateOne({ postId: id, userId }, {
            "$set": {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
        logger.info(`Post successfully deleted with id : ${id}`)
        return res.json(todo);
    } catch (error) {
        logger.error(`Error in deleting post details: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
}

module.exports = {
    createPost,
    list,
    getPost,
    updatePostDetails,
    deletePost
}