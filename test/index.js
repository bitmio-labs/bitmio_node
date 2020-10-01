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
        const result1 = await bitmio.createApp('myapp', 'My App');
        assert.ok(result1.success);

        const result2 = await bitmio.createApp('myotherapp', 'My Other App');
        assert.ok(result2.success);
    });

    it('should list my apps', async () => {
        const result = await bitmio.listApps();
        console.log(result);
        assert.ok(result.length, 2);
    });

    it('should delete apps', async () => {
        const result1 = await bitmio.deleteApp('myapp');
        assert.ok(result1.success);

        const result2 = await bitmio.deleteApp('myotherapp');
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
