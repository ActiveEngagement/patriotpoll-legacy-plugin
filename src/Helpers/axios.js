import Axios from 'axios';

const BASE_URL = 'https://api.patriotpoll.net/v1';

const instance = Axios.create({
    baseURL: process.env.VUE_APP_BASE_URL || BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.VUE_APP_API_KEY}`
    }
});

export default instance;