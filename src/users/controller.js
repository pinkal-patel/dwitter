//Internal Imports
const UserModel = require('./model');
const logger = require("../config/logger")("users-controller");

// fetch user list with their post,comments and todos
const list = async (req, res) => {
    try {
        let { page = 1, limit = 10, sort = { createdAt: -1 }, filter = {} } = req.body;
        logger.info(`User Filter : ${JSON.stringify(filter)}`)
        let userData = await UserModel.aggregate([
            {
                $match: filter
            },
            {
                // get todos for the user
                $lookup: {
                    from: "todos",
                    localField: 'userId',
                    foreignField: 'userId',
                    pipeline: [{ $match: { $expr: { $eq: [false, "$isDeleted"] } } }, {
                        $project: {
                            "todoId": 1,
                            "title": 1,
                            "status": 1

                        }
                    }],
                    as: "todos",
                }
            },
            {
                // get posts for the user
                $lookup: {
                    from: "posts",
                    localField: 'userId',
                    foreignField: 'userId',
                    pipeline: [{ $match: { $expr: { $eq: [false, "$isDeleted"] } } }, {
                        $project: {
                            "postId": 1,
                            "userId": 1,
                            "title": 1,
                            "body": 1,
                            "createdAt": 1
                        }
                    }],
                    as: "posts"
                }
            },
            {
                $unwind: "$posts"
            },
            {
                // get comments of the post
                $lookup: {
                    from: "comments",
                    localField: 'posts.postId',
                    foreignField: 'postId',
                    pipeline: [{ $match: { $expr: { $eq: [false, "$isDeleted"] } } }, {
                        $project: {
                            "postId": 1,
                            "commentId": 1,
                            "body": 1,
                            "name": 1,
                            "userId": 1,
                            "createdAt": 1
                        }
                    }],
                    as: "posts.comments",
                }
            },
            // pagination
            { $limit: limit },
            { $skip: (page - 1) * limit },
            { $sort: sort },
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    userName: { $first: "$userName" },
                    email: { $first: "$email" },
                    todos: { $first: "$todos" },
                    posts: {
                        $push: "$posts"
                    }
                }
            }
        ])
        res.json({
            data: Object.values(userData),
            page,
            limit
        });
    } catch (error) {
        logger.error(`Error in fetching users details: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
}

// update user details
const updateUserDetails = async (req, res) => {
    try {
        let { id } = req.params;
        const { userId, role: requestedUserRole } = req.user || {}
        // users can edit their own details and admin user can edit all other user details
        if (userId == id || (requestedUserRole && requestedUserRole.toLowerCase() == "admin")) {
            const { role, userName } = req.body;

            // db call to get user details
            let userDetails = await UserModel.findOne({ userId: id }).lean();

            //if user details not fount for requested user then throw error
            if (!userDetails) throw new error(`todo not found for user`)

            //If there is any change userName or role then only update user
            if ((userName && userDetails.userName !== userName) || (role && userDetails.role !== role)) {
                let updateObj = {
                    ...userName && { userName },
                    ...role && { role },
                    updatedAt: new Date()
                }
                // db call to update user
                let result = await UserModel.updateOne({ userId: id, isDeleted: false }, { "$set": updateObj })
                logger.info(`userDetails successfully updated with id : ${id}`)
                return res.json(result);
            } else {
                logger.error(`There is no change in userDetails details for : ${id}`)
                return res.status(200).send({
                    message: "No Changes found"
                });
            }
        } else {
            logger.error(` ${userId} not authorized to update the user details of other users`)
            return res.status(200).send({
                message: "not authorized to upate the user details of other users"
            });
        }

    } catch (error) {
        logger.error(`Error in updating userDetails  details: ${error}`)
        return res.status(500).send({
            message: error.message
        });
    }
};

module.exports = {
    list,
    updateUserDetails
}