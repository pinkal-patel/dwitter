//Internal Imports
var controller = require('./controller');

module.exports = (app) => {

    //to create comment on the post
    app.post('/:postId/comment/create', controller.createComment);

    //to fetch the comments of the post
    app.post('/:postId/comment/list', controller.list);

    //to edit the comment
    app.post('/comment/:id/edit', controller.updateCommentDetails);

    //to delete the comment
    app.get('/comment/:id/delete', controller.deleteComments);
};