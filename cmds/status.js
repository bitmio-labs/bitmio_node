const bitmio = require('../').bitmio;

exports.command = 'status'
exports.desc = 'Bitmio API status.'
exports.builder = {}
exports.handler = async function (argv) {
    const res = await bitmio.status();

    console.log(res);
}