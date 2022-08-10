const statusCode = require('../status');


function main() {
    return {
        code: statusCode.success,
        msg: 'welcom to work'
    };
}


module.exports = {
    main,
};