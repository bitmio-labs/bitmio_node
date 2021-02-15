require('dotenv').config();

const request = require('superagent');

const DEFAULT_CONFIG = {
    host: 'https://api.bitmio.com/v1'
};

class Bitmio {
    constructor({ host } = DEFAULT_CONFIG) {
        this.host = host;
    }

    async status() {
        const url = `${this.host}/status`;

        const res = await request.get(url);

        return res.body;
    }

    async version() {
        const status = await this.status();

        return status.version;
    }

    login() {
        const url = `${this.host}/kollab/authorize`;

        return url;
    }

    getUserClient({ access_token }) {
        return new BitmioUserClient({ host: this.host, access_token });
    }
}

class BitmioUserClient {
    constructor({ host, access_token, api_key } = DEFAULT_CONFIG) {
        this.host = host;
        this.access_token = access_token;
        this.api_key = api_key;
    }

    async me() {
        const url = `${this.host}/kollab/me`;

        try {
            const res = await request
                .get(url)
                .set('Authorization', `Bearer ${this.access_token}`);

            return res.body;
        } catch (err) {
            return err.response.body;
        }
    }

    async createAPIKey({ name }) {
        const url = `${this.host}/kollab/api_keys?name=${name}`;

        try {
            const res = await request
                .post(url)
                .set('Authorization', `Bearer ${this.access_token}`);

            return res.body;
        } catch (err) {
            return err.response.body;
        }
    }

    async listAPIKeys() {
        const url = `${this.host}/kollab/api_keys`;

        try {
            const res = await request
                .get(url)
                .set('Authorization', `Bearer ${this.access_token}`);

            return res.body;
        } catch (err) {
            return err.response.body;
        }
    }

    async deleteAPIKey({ name }) {
        const url = `${this.host}/kollab/api_keys?name=${name}`;

        try {
            const res = await request
                .delete(url)
                .set('Authorization', `Bearer ${this.access_token}`);

            return res.body;
        } catch (err) {
            return err.response.body;
        }
    }
}

const bitmio = new Bitmio();

module.exports = {
    bitmio,
    Bitmio,
    BitmioUserClient
}