const Cryptr = require('cryptr');
const fs = require('fs');
const user = require('../db/user.json');
const config = require('../config');
const statusCode = require('../status');
const utils = require('../utils');



/**
 *
 * @param {string} username
 * @param {string} password
 * @returns
 */
function createUser(username, password) {
    if (!(username && password)) {
        return {
            code: statusCode.forbiddan,
            msg: "missing parameter"
        };
    }

    const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;

    const cryptr = new Cryptr(config.cryptrKey);
    const decryptedPassword = cryptr.decrypt(password);


    // password strength does not meet requirements
    if(!passwordRegx.test(decryptedPassword)) {
        return {
            code: statusCode.badRequest,
            msg: "passowrd must contain an uppercase letter, a lowercase letter, a number, a special character, and a length of at least 8 characters"
        };
    }



    const findIndex = user.findIndex(item => {
        if (item.name === username) {
            return true;
        }
    });

    if(findIndex !== -1) {
        return {
            code: statusCode.forbiddan,
            msg: "user already exists"
        };

    } else {
        const cryptr = new Cryptr(config.cryptrKey);
        const decryptedPassword = cryptr.decrypt(password);

        let newData = Object.assign([], user);

        newData.push({
            id: `s-${Math.floor(Math.random()*1000)}`,
            name: username,
            password: decryptedPassword,
            role: [],
            token: "",
            expireTime: ""
          },);

        utils.writeDB('src/db/user.json', newData);
        return {
            code: statusCode.success,
            msg: 'success'
        }

    }

}

/**
 *
 * @param {string} userId
 * @returns {}
 */
function deleteUser(userId) {
    if (!userId) {
        return {
            code: statusCode.forbiddan,
            msg: "missing parameter"
        };
    }


    const findIndex = user.findIndex(item => {
        if (item.id === userId) {
            return true;
        }
    });


    if(findIndex === -1) {
        return {
            code: statusCode.badRequest,
            msg: "user does not exist"
        };

    } else {

        let newData = Object.assign([], user);
        newData.splice(findIndex, 1);

        utils.writeDB('src/db/user.json', newData);

        return {
            code: statusCode.success,
            msg: "success"
        };
    }
}



module.exports = {
    createUser,
    deleteUser,
};