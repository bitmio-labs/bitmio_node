require('dotenv').config();

const assert = require('assert');
const { BITMIO_API_KEY } = process.env;

let bitmio = require('../').bitmio;

if (process.env.LOCAL_TEST) {
    const { Bitmio } = require('../');
    bitmio = new Bitmio({ host: 'http://localhost:5000/v1' });
}

assert.ok(BITMIO_API_KEY, 'Needs API key');

describe('Bitmio API', () => {
    it('should return status', async () => {
        const res = await bitmio.status();

        assert.ok(res);
    });

    it('should return version', async () => {
        const res = await bitmio.version();

        assert.strictEqual(res, '0.0.1');
    });
});
