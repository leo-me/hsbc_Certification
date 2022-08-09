const role = require('../db/role.json');



function createRole(roleName) {
    if (!roleName) {
        return {
            code: statusCode.forbiddan,
            msg: "missing parameter"
        };
    }

    if(typeof roleName !== 'string') {
        return {
            code: statusCode.forbiddan,
            msg: "roleName's format not right"
        };
    }


    const findIdx = role.findIndex(i => i.name === roleName);

    if (findIdx > -1) {
        return {
            code: statusCode.forbiddan,
            msg: "this role name already exsist"
        };
    } else {
        let newData = Object.assign([], user);
        let len = newData.length;

        newData.push({
            "id": len,
            "name": role,
            "desc": "",
            "permission": []
        });

        fs.writeFile('src/db/role.json', JSON.stringify(newData), function (err) {
            if (err) {
                console.log('err: ', err);
            }
        });
    }
}


function deleteRole(roleId) {
    if (!roleId) {
        return {
            code: statusCode.forbiddan,
            msg: "missing parameter"
        };
    }

    if(typeof roleId !== 'number') {
        return {
            code: statusCode.forbiddan,
            msg: "roId should be a number"
        };
    }





}


function addRoleToUser(userId, roleId) {

}

function checkRole(token, role) {

}

function getAllRoles(token) {

}




module.exports = {
    createRole,
    deleteRole,
    addRoleToUser,
};