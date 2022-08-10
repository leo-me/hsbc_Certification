const fs = require('fs');
const Cryptr = require('cryptr');


function parseQuery(queryString) {
    let query = {};

    if (!queryString) return query;

    let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');

    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }


  function parseCookies (request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}


/**
 *
 * @param {string} token
 * @param {string} key
 */
function parseToken (token, key) {
    const cryptr = new Cryptr(key);

    try {
        const decryptedToken = cryptr.decrypt(token);
        const tokenArr = decryptedToken.split('-');
        const username = tokenArr[0];
        const expireTime = tokenArr[1];

        return {
            username,
            expireTime,
        };

    } catch (error) {
        return {};
    }

}

/**
 *
 * @param {*} db
 * @param {*} data
 */
 function writeDB(db, data) {
    if(!(db && data)) return;

    fs.writeFile(db, JSON.stringify(data), function (err) {
        if (err) {
            console.log('err: ', err);
        }
    });

 }

 function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}


  module.exports = {
    parseQuery,
    parseCookies,
    parseToken,
    writeDB,
    randomString
  };