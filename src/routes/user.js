function createUser(name, password) {
    if (!(username && password)) {
        return {
            code: statusCode.forbiddan,
            msg: "missing parameter"
        };
    }

}

function deleteUser(user) {

}



module.exports = {
    createUser,
    deleteUser,
};