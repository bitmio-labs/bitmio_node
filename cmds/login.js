const bitmio = require('../').bitmio;
const Configstore = require('configstore');
const packageJson = require('../package.json');

const config = new Configstore(packageJson.name, {});

exports.command = 'login'
exports.desc = 'Login or signup.'
exports.builder = {}
exports.handler = async function (argv) {
    const res = bitmio.login();

    console.log('Open this authentication url in your browser:');
    console.log(res);
    console.log('');

    const { access_token } = await prompt({
        type: 'input',
        name: 'access_token',
        message: 'Paste your access token from the success page:'
    });

    const client = bitmio.getUserClient({ access_token });

    const me = await client.me();

    config.set('access_token', access_token);

    console.log(me);
}