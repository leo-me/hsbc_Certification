const login = require('./login');
const role = require('./role');
const user = require('./user');
const work = require('./work');


function route(path, query) {
    console.log('query: ', query);
    console.log('path: ', path);

    switch (path) {
        case '/login':
            return login.authenticate(query);
        case '/logout':
                return login.invalidate(query);
        case '/work':
            // islogin

            return work.main();
        case '/role/add':
            // islogin
            // what's the role

            return role.addRoleToUser();
        case '/role/delete':
            // islogin
            // what's the role

            return role.deleteRole();
        case '/user/add':
            // islogin
            // what's the role

            return user.createUser();
        case '/user/delete':
            // islogin
            // what's the role

            return user.deleteUser();
        default:
            return 'welcome';
    }
}


module.exports = {
    route
};