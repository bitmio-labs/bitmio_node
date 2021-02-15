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
}

const bitmio = new Bitmio();

module.exports = {
    bitmio,
    Bitmio
}