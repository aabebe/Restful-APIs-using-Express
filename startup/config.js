const config = require('config');
module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        // console.log('Fatal Error :jwtPrivateKey is not defined');
        // process.exit(1);
        throw new Error('Fatal Error :jwtPrivateKey is not defined');
    }
}