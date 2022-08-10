const login = require('./login');
const role = require('./role');
const user = require('./user');
const work = require('./work');


function route(path, params) {
    const {
        username,
        password,
        userId,
        roleName,
        roleId,
        token,
    } = params;

    switch (path) {
        case '/login':
            return login.authenticate(username, password);
        case '/logout':
            return login.invalidate(token);
        case '/work':
            // islogin

            return work.main();
        case '/role/add':
            // check the role

            return role.createRole(roleName);
        case '/role/delete':
            // islogin
            // what's the role

            return role.deleteRole(roleId);
        case '/role/addToUser':
            // islogin
            // what's the role
            return role.addRoleToUser(userId, roleId);
        case '/role/check':
            // islogin
            // what's the role
            return role.checkRole(token, roleId);
        case '/role/addToUser':
            // islogin
            // what's the role
            return role.addRoleToUser(userId, roleId);
        case '/role/list':
                // islogin
                // what's the role
                return role.getAllRoles(token);
        case '/user/add':
            // check the role

            return user.createUser(username, password);
        case '/user/delete':
            // islogin
            // what's the role
            return user.deleteUser(userId);
        default:
            return {
                code: 200,
                msg: 'welcome'
            };
    }
}


module.exports = {
    route
};