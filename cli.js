#!/usr/bin/env node
const bitmio = require('./index').bitmio;
const { prompt } = require('enquirer');
const Configstore = require('configstore');
const packageJson = require('./package.json');

const config = new Configstore(packageJson.name, {});

require('yargs')
    .scriptName("bitmio")
    .usage('$0 <cmd> [args]')
    .command('status', 'Bitmio API status.', () => { }, async function (argv) {
        const res = await bitmio.status();

        console.log(res);
    })
    .command('version', 'Bitmio API version.', () => { }, async function (argv) {
        const res = await bitmio.version();

        console.log(res);
    })
    .command('login', 'Login or signup.', () => { }, async function (argv) {
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
    })
    .command('logout', 'Logout.', () => { }, async function (argv) {
        config.delete('access_token');
    })
    .command('account', 'My account.', () => { }, async function (argv) {
        const access_token = config.get('access_token');

        const client = await bitmio.getUserClient({ access_token });
        const res = await client.me();

        console.log(res);
    })
    .command('api-keys-create [name]', 'Create an API key.', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: 'default',
            describe: 'API key name'
        });
    }, async function (argv) {
        const { name } = argv
        const access_token = config.get('access_token');

        const client = await bitmio.getUserClient({ access_token });
        const res = await client.createAPIKey({ name });

        console.log(res);
    })
    .command('api-keys-list', 'List all your API keys.', () => { }, async function (argv) {
        const access_token = config.get('access_token');

        const client = await bitmio.getUserClient({ access_token });
        const res = await client.listAPIKeys();

        console.log(res.items);
    })
    .command('api-keys-delete [name]', 'Delete an API key.', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: 'default',
            describe: 'API key name'
        });
    }, async function (argv) {
        const { name } = argv
        const access_token = config.get('access_token');

        const client = await bitmio.getUserClient({ access_token });
        const res = await client.deleteAPIKey({name});

        console.log(res);
    })
    .command('create-project [name]', 'Create your project.', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: 'My Project',
            describe: 'Your Project name'
        })
    }, function (argv) {
        console.log('Creating project', argv.name, '...')
    })
    .help()
    .argv