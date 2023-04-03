//Internal Imports
var controller = require('./controller');

module.exports = (app) => {

    // To create new todo
    app.post('/todo/create', controller.createTodo);

    // To fetch todo list
    app.post('/todo/list', controller.list);

    //To get todo details
    app.get('/todo/:id', controller.getTodoDetails);

    //To edit todo details
    app.post('/todo/:id/edit', controller.updateTodoDetails);

    //To delete todo
    app.get('/todo/:id/delete', controller.deleteTodo);
};