module.exports = function (app) {
    require('../authentication/auth')(app);
    require('../users/index')(app);
    require('../posts/index')(app);
    require('../todos/index')(app);
    require('../comments/index')(app);
};