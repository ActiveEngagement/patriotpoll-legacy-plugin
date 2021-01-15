import Axios from 'axios';

export const BASE_URL = 'https://api.patriotpoll.net/v1';

export default function(Vue, options = {}) {
    // If Axios is not installed, then just ignore the plugin.
    if(!Axios) {
        return;
    }

    // Get the api key from the options or config file.
    const apiKey = options.apiKey || process.env.VUE_APP_PATRIOT_POLL_API_KEY;

    // Gethe base url from the options or config file.
    const baseURL = options.baseUrl
        || options.baseURL
        || process.env.VUE_APP_PATRIOT_POLL_BASE_URL
        || BASE_URL;
    
    // Create an Axios instance.
    const axios = Axios.create({
        baseURL,
        headers: {
            Authorization: apiKey && `Bearer ${apiKey}`
        }
    });
    
    // Get the data from storage and set the request headers.
    try {
        const store = JSON.parse(window.localStorage.__poll__);
        
        delete store.answer;
        
        for(let [key, value] of Object.entries(store)) {
            axios.defaults.headers[`Contact-${key.charAt(0).toUpperCase() + key.slice(1)}`] = value;
        }
    }
    catch (e) {
        // Ignore the error
    }

    // Set the axios instace on the prototype.
    Vue.prototype.$patriotpoll = axios;
}