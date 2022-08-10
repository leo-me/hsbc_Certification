const roleDB = require('../db/role.json');
const userDB = require('../db/user.json');

const login = require('../routes/login');
const statusCode = require('../status');
const utils = require('../utils');
const config = require('../config');



function createRole(roleName) {
    if (!roleName) {
        return {
            code: statusCode.forbiddan,
            msg: "missing parameter"
        };
    }

    const roleNameRegx = /^[a-z_]{5,}$/i;

    if(!roleNameRegx.test(roleName)) {
        return {
            code: statusCode.forbiddan,
            msg: "roleName's format not right"
        };
    }


    const findIdx = roleDB.findIndex(i => i.name === roleName);

    if (findIdx > -1) {
        return {
            code: statusCode.forbiddan,
            msg: "this role name already exsist"
        };
    } else {
        let newData = Object.assign([], roleDB);

        newData.push({
            "id":  `r-${Math.floor(Math.random()*100000)}`,
            "name": roleName,
            "desc": "",
            "permission": []
        });

        // fs.writeFile('src/db/role.json', JSON.stringify(newData), function (err) {
        //     if (err) {
        //         console.log('err: ', err);
        //     }
        // });

        utils.writeDB('src/db/role.json', newData);

        return {
            code: statusCode.success,
            msg: "success"
        };
    }
}

/**
 *
 * @param {number} roleId
 * @returns
 */
function deleteRole(roleId) {
    if (!roleId) {
        return {
            code: statusCode.forbiddan,
            msg: "missing parameter"
        };
    }

    const roleIdx = roleDB.findIndex(i => i.id === roleId);

    if(roleIdx === -1) {
        return {
            code: statusCode.badRequest,
            msg: "role does not exist"
        };

    } else {

        let newData = Object.assign([], roleDB);
        newData.splice(roleIdx, 1);

        utils.writeDB('src/db/role.json', newData);

        return {
            code: statusCode.success,
            msg: "success"
        };
    }


}

/**
 *
 * @param {number} userId
 * @param {number} roleId
 */
function addRoleToUser(userId, roleId) {
    if (!(userId && roleId)) {
        return {
            code: statusCode.forbiddan,
            msg: "missing parameter"
        };
    }

    const roleIdx = roleDB.findIndex(i => i.id === roleId);
    const userIdx = userDB.findIndex(i => i.id === userId);

    if(roleIdx !== -1 && userIdx !== -1) {
        let userRole = userDB[userIdx].role;
        if(userRole.includes(roleId)) {
            return {
                code: statusCode.badRequest,
                msg: "already have the role"
            };
        } else {
            const newData = Object.assign([], userDB);
            newData[userIdx].role.push(roleId);
            utils.writeDB('src/db/user.json', newData);

            return {
                code: statusCode.success,
                msg: "success"
            };
        }
    } else {

        return {
            code: statusCode.badRequest,
            msg: `wrong ${roleIdx === -1 ? 'roleId' : 'userId'}`
        };
    }
}

/**
 *
 * @param {string} token
 * @param {*} roleId
 */
function checkRole(token, roleId) {
    if (!(token && roleId)) {
        return {
            code: statusCode.badRequest,
            msg: "missing parameter"
        };
    }

    const isValid = login.checkTokenValid(token);

    if(isValid) {
        // parsetoken
        const { username } = utils.parseToken(token, config.cryptrKey);

        const findInfo = userDB.find(i => i.name === username);

        if(findInfo) {
            const findRole = findInfo.role.findIndex(r => r === roleId);

            if(findRole !== -1) {
                return {
                    code: statusCode.success,
                    status: true,
                    msg: 'valid',
                };
            } else {
                return {
                    code: statusCode.success,
                    status: false,
                    msg: 'not valid',
                };
            }


        } else {
            return {
                code: statusCode.badRequest,
                msg: "user not exsist"
            };
        }

    } else {
        return {
            code: statusCode.forbiddan,
            msg: "login authentication expired"
        };
    }


}

/**
 *
 * @param {string} token
 */
function getAllRoles(token) {
    if (!token) {
        return {
            code: statusCode.badRequest,
            msg: "missing parameter"
        };
    }

    const isValid = login.checkTokenValid(token);

    if(isValid) {
        return {
            code: statusCode.success,
            data: roleDB,
        };

    } else {
        return {
            code: statusCode.forbiddan,
            msg: "login authentication expired"
        };
    }
}




module.exports = {
    createRole,
    deleteRole,
    addRoleToUser,
    getAllRoles,
    checkRole,
};