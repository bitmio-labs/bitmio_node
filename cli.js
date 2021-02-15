#!/usr/bin/env node
const bitmio = require('./index').bitmio;

require('yargs')
    .scriptName("bitmio")
    .usage('$0 <cmd> [args]')
    .command('status', 'Bitmio system status.', () => { }, async function (argv) {
        const res = await bitmio.status();
        
        console.log(res);
    })
    .command('version', 'Bitmio version.', () => { }, async function (argv) {
        const res = await bitmio.version();

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