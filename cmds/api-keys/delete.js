const bitmio = require('../..').bitmio;
const Configstore = require('configstore');
const packageJson = require('../../package.json');

const config = new Configstore(packageJson.name, {});

exports.command = 'delete [name]'
exports.desc = 'Delete API key.'
exports.builder = {
    name: {
        default: 'default'
    }
}
exports.handler = async function (argv) {
    const { name } = argv
    const access_token = config.get('access_token');

    const client = await bitmio.getUserClient({ access_token });
    const res = await client.deleteAPIKey({ name });

    console.log(res);
}