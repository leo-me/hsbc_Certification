const Cryptr = require('cryptr');
const fs = require('fs');
const user = require('../db/user.json');
const config = require('../config');
const statusCode = require('../status');
const utils = require('../utils');


/**
 *
 * @param {string} username
 * @param {string} password  with aes encryption
 * @returns {object}
 */
function authenticate(username, password) {

    if (!(username && password)) {
        return {
            code: statusCode.forbiddan,
            msg: "missing parameter"
        };
    }

    const cryptr = new Cryptr(config.cryptrKey);

    try {
        const decryptedPassword = cryptr.decrypt(password);

        const findIndex = user.findIndex(item => {
            if (item.name === username && item.password === decryptedPassword) {
                return true;
            }
        });



        if (findIndex !== -1) {
            let newData = Object.assign([], user);
            let token = user[findIndex].token;
            let expires = newData[findIndex].expireTime;
            let now = Date.now();


            // not find or the token has expired
            if(typeof token === 'undefined' || (expires && now > expires)) {
                // generate token
                const expireTime = now + 2 *60* 60 * 1000;
                token = cryptr.encrypt(`${username}-${expireTime}`);

                newData[findIndex].token = token;
                newData[findIndex].expireTime = expireTime;

                utils.writeDB('src/db/user.json', newData);
            }

            return {
                code: statusCode.success,
                msg: 'login success',
                token,
            };

        } else {
            return {
                code: statusCode.badRequest,
                msg: 'login fail, please check your name or password'
            };
        }

    } catch (error) {
        // console.log('error: ', error);

        return {
            code: statusCode.badRequest,
            msg: "please check your input"
        };
    }
}


/**
 *
 * @param {string} token with aes encryption
 * @returns {void}
 */
function invalidate(token) {
    if(!token) return;

    const cryptr = new Cryptr(config.cryptrKey);
    try {
        const decryptedToken = cryptr.decrypt(token);
        const tokenArr = decryptedToken.split('-');
        const username = tokenArr[0];
        const expireTime = tokenArr[1];

        if(typeof username !== 'string' || typeof expireTime !== 'number') {
            return;
        }

        const findIndex = user.findIndex(item => item.name === username);

        if(findIndex !== -1) {
            let newData = Object.assign([], user);
            newData[findIndex].token = '';
            newData[findIndex].expireTime = '';

            utils.writeDB('src/db/user.json', newData);

            // fs.writeFile('src/db/user.json', JSON.stringify(newData), function (err) {
            //     if (err) {
            //         console.log('err: ', err);
            //     }
            // });
        }


    } catch (error) {
        return;
    }

}

/**
 *
 * @param {string} token
 * @returns {boolean}
 */
function checkTokenValid(token) {
    if(!token) return false;

    const cryptr = new Cryptr(config.cryptrKey);
    try {
        const decryptedToken = cryptr.decrypt(token);
        const tokenArr = decryptedToken.split('-');
        const username = tokenArr[0];
        let expireTime = tokenArr[1];
        expireTime = Number(expireTime);

        const now = Date.now();

        if(!(username && expireTime)) {
            return false;
        }

        const findIndex = user.findIndex(item => item.name === username);

        if(findIndex !== -1 && now < expireTime) {
            return true;
        }

    } catch (error) {
        // console.log('error: ', error);
        return false;
    }

    return false;
}


module.exports = {
    authenticate,
    invalidate,
    checkTokenValid
};