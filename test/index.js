require('dotenv').config();

const assert = require('assert');
const { BITMIO_API_KEY } = process.env;

let bitmio = require('../').bitmio;

if (process.env.LOCAL_TEST) {
    const { Bitmio } = require('../');
    bitmio = new Bitmio({ host: 'http://localhost:5000/v1' });
}

assert.ok(BITMIO_API_KEY, 'Needs API key');

describe('Bitmio for Node', () => {
    it('should return an auth URI', async () => {
        const url = await bitmio.authUri();

        console.log(url);
        assert.ok(url);
    });

    it('should authenticate the lib', async () => {
        await bitmio.auth(BITMIO_API_KEY);
    });

    // it('should create an API key', async () => {
    //     const result = await bitmio.createApiKey();

    //     console.log(result);
    // });

    it('should fetch me', async () => {
        const result = await bitmio.me();
        console.log(result);

        assert.ok(result.email);
    });

    // it('should list all apps', async () => {
    //     const apps = await bitmio.apps();
    //     assert.ok(apps.length > 0);
    // });

    // it('should list authorized apps', async () => {
    //     const apps = await bitmio.authorizedApps();
    //     assert.strictEqual(apps.length, 3);
    // });

    it('should return an app auth link', async () => {
        const result = await bitmio.authorizeAppUrl('basecamp');
        console.log(result);
        // assert.ok(url);
    });

    it('should call an app endpoint', async () => {
        const url = `https://3.basecampapi.com/4508093/buckets/19009682/todolists/3071657753/todos.json`;
        const result = await bitmio.call('basecamp', { url });

        const todos = result.map(each => each.title);
        console.log(todos);
    });

    it('should create two apps', async () => {
        const result1 = await bitmio.createApp('gravatar', 'Gravatar');
        assert.ok(result1.success);

        const result2 = await bitmio.createApp('mybasecamp', 'My Basecamp');
        assert.ok(result2.success);
    });

    it('should list my apps', async () => {
        const result = await bitmio.listApps();
        console.log(result);
        assert.ok(result.length, 2);
    });

    it('should add a function', async () => {
        const someFunction = {
            id: 'get_gravatar_url',
            name: 'Get Gravatar URL',
            route: '/gravatar/${email}',
            input: [{ id: 'email', type: 'text', example: 'test@example.com' }],
            output: [{ id: 'gravatar_url', type: 'text', example: '...', value: '${gravatar_url.result}' }],
            actions: [
                { id: 'trim_email', function: 'trim', value: '${input.email}' },
                { id: 'lowercase_email', function: 'lowercase', value: '${trim_email.result}' },
                { id: 'md5_email', function: 'md5', value: '${lowercase_email.result}' },
                { id: 'gravatar_url', value: 'https://www.gravatar.com/avatar/${md5_email.result}' }
            ]
        }

        await bitmio.createFunction('gravatar', someFunction);
    });

    it('should list my functions', async () => {
        const result = await bitmio.listFunctions('gravatar');

        assert.strictEqual(result.length, 1);
    });

    it('should get a function config', async () => {
        const result = await bitmio.getFunction('gravatar', 'get_gravatar_url');

        assert.strict(result.actions, 4);
    });

    it('should call my function', async () => {
        const result = await bitmio.callFunction('gravatar', 'get_gravatar_url', { email: 'mail@mirkokiefer.com' });

        assert.ok(result.gravatar_url);
    });

    it('should delete my function', async () => {
        await bitmio.deleteFunction('gravatar', 'get_gravatar_url');
    });

    // it('should add a function requiring auth', async () => {
    //     const someFunction = {
    //         id: 'create_project',
    //         name: 'Create a project',
    //         method: 'POST',
    //         route: '/projects',
    //         input: [
    //             { id: 'title', type: 'text', example: 'My Project' },
    //             { id: 'basecamp_auth', type: 'auth', app_id: 'basecamp' }
    //         ],
    //         output: [{ id: 'success', type: 'boolean', value: '${gravatar_url.result}' }],
    //         actions: [
    //             { id: 'call_api', function: 'http_request', auth: 'basecamp_auth', url: '' }
    //         ]
    //     }

    //     await bitmio.createFunction('mybasecamp', someFunction);
    // });

    it('should delete apps', async () => {
        const result1 = await bitmio.deleteApp('gravatar');
        assert.ok(result1.success);

        const result2 = await bitmio.deleteApp('mybasecamp');
        assert.ok(result2.success);
    });

    it('should fail deleting an app without admin role', async () => {
        try {
            await bitmio.deleteApp('kollab');
            assert.ok(false);
        } catch (err) {
            assert.ok(true);
        }
    });
});
