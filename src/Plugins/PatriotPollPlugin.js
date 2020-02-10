import Axios from 'axios';

export const BASE_URL = 'https://api.patriotpoll.net/v1';

export default function(Vue, options = {}) {
    const apiKey = options.apiKey || process.env.VUE_APP_PATRIOT_POLL_API_KEY;

    const baseURL = options.baseUrl
        || options.baseURL
        || process.env.VUE_APP_PATRIOT_POLL_BASE_URL
        || BASE_URL;
    
    const axios = Axios.create({
        baseURL,
        headers: {
            Authorization: apiKey && `Bearer ${apiKey}`
        }
    });

    Vue.prototype.$patriotpoll = axios;
}