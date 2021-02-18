const bitmio = require('../').bitmio;

exports.command = 'version'
exports.desc = 'Bitmio API version.'
exports.builder = {}
exports.handler = async function (argv) {
    const res = await bitmio.version();

    console.log(res);
}