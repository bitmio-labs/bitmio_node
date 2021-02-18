const bitmio = require('../..').bitmio;
const Configstore = require('configstore');
const packageJson = require('../../package.json');

const config = new Configstore(packageJson.name, {});

exports.command = 'list'
exports.desc = 'List API keys.'
exports.handler = async function (argv) {
    const access_token = config.get('access_token');

    const client = await bitmio.getUserClient({ access_token });
    const res = await client.listAPIKeys();

    console.log(res.items);
}