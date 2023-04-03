//Internal Imports
var controller = require('./controller');

module.exports = (app) => {

    // To register new user
    // app.post('/user/register', controller.register);

    // To login 
    app.post('/user/list', controller.list);

    //To edit user details
    app.post('/user/:id/edit', controller.updateUserDetails);
};