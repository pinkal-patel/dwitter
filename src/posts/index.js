//Internal Imports
var controller = require('./controller');

module.exports = (app) => {

    //To create post
    app.post('/post/create', controller.createPost);

    //To fetch post list
    app.post('/post/list', controller.list);

    //To get post details
    app.get('/post/:id', controller.getPost);

    //To edit post details
    app.post('/post/:id/edit', controller.updatePostDetails);

    //To delete post
    app.get('/post/:id/delete', controller.deletePost);
};