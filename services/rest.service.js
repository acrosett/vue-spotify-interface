
export class RestService {

    constructor() {
        this.axios = require('axios').default;
    }

    post(url, data, options) {
        return this.axios.post(url, data, options);
    }

    get(url, params) {
        return this.axios.get(url, params);
    }


}