const bitmio = require('../').bitmio;
const Configstore = require('configstore');
const packageJson = require('../package.json');

const config = new Configstore(packageJson.name, {});

exports.command = 'logout'
exports.desc = 'Logout.'
exports.builder = {}
exports.handler = async function (argv) {
    config.delete('access_token');
}