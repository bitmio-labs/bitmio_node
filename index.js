require('dotenv').config();

const request = require('superagent');

const DEFAULT_CONFIG = {
    host: 'https://api.bitmio.com/v1'
};

class Bitmio {
    constructor({ host } = DEFAULT_CONFIG) {
        this.host = host;
    }

    auth(apiKey) {
        this.apiKey = apiKey;
    }

    async createApiKey() {
        const apiKey = this.apiKey;
        const url = `${this.host}/kollab/api_keys`;

        const { body } = await request
            .post(url)
            .set('Authorization', `Bearer ${apiKey}`);

        return body;
    }

    async me() {
        const apiKey = this.apiKey;
        const url = `${this.host}/kollab/me`;

        const { body } = await request
            .get(url)
            .set('Authorization', `Bearer ${apiKey}`);

        return body;
    }

    async authUri() {
        const url = `${this.host}/kollab/auth`;

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
        const url = `${this.host}/kollab/integrations/${appID}/auth`;

        const { body } = await request
            .get(url)
            .set('Authorization', `Bearer ${apiKey}`);

        return body;
    }

    async call(app_id, { url, method, body, headers }) {
        const apiKey = this.apiKey;
        const bitmioUrl = `${this.host}/kollab/integrations/${app_id}/call`;
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

    async createApp(id, name) {
        const apiKey = this.apiKey;
        const url = `${this.host}/kollab/apps`;

        const sentBody = { id, name };

        const { body: responseBody } = await request
            .post(url)
            .set('Authorization', `Bearer ${apiKey}`)
            .send(sentBody);

        return responseBody;
    }

    async listApps() {
        const apiKey = this.apiKey;
        const url = `${this.host}/kollab/apps`;

        const { body: responseBody } = await request
            .get(url)
            .set('Authorization', `Bearer ${apiKey}`);

        const { items } = responseBody;

        return items;
    }

    async deleteApp(app_id) {
        const apiKey = this.apiKey;
        const url = `${this.host}/kollab/apps/${app_id}`;

        const { body: responseBody } = await request
            .delete(url)
            .set('Authorization', `Bearer ${apiKey}`);

        return responseBody;
    }
}

const bitmio = new Bitmio();

module.exports = {
    bitmio,
    Bitmio
}