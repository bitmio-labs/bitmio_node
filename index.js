require('dotenv').config();

const request = require('superagent');

const host = 'https://api.bitmio.com/v1';

const frontend_host = 'https://bitmio.com/';
const authUrl = `${frontend_host}/auth`;

class Bitmio {
    constructor() {

    }

    auth(apiKey) {
        this.apiKey = apiKey;
    }

    async createApiKey() {
        const apiKey = this.apiKey;
        const url = `${host}/kollab/api_keys`;

        const { body } = await request
            .post(url)
            .set('Authorization', `Bearer ${apiKey}`);

        return body;
    }

    async me() {
        const apiKey = this.apiKey;
        const url = `${host}/kollab/me`;

        const { body } = await request
            .get(url)
            .set('Authorization', `Bearer ${apiKey}`);

        return body;
    }

    async authUri() {
        const url = `${host}/kollab/auth`;

        const result = await request.get(url);

        return result.body.auth_uri;
    }

    async apps() {
        return [];
    }

    async authorizedApps() {
        return [];
    }

    async authorizeAppUrl(appID) {
        const apiKey = this.apiKey;
        const url = `${host}/kollab/integrations/${appID}/auth`;

        const { body } = await request
            .get(url)
            .set('Authorization', `Bearer ${apiKey}`);

        return body;
    }

    async call(app_id, { url, method, body, headers }) {
        const apiKey = this.apiKey;
        const bitmioUrl = `${host}/kollab/integrations/${app_id}/call`;
        const sentBody = { url, method, body, headers };

        try {
            const { body: resultBody } = await request
                .post(bitmioUrl)
                .send(sentBody)
                .set('Authorization', `Bearer ${apiKey}`);

            return resultBody;
        } catch (err) {
            console.error(err);
        }

    }
}

const bitmio = new Bitmio();

module.exports = {
    bitmio,
    Bitmio
}