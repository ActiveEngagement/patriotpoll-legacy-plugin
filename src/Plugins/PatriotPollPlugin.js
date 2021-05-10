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
    
    Vue.prototype.$patriotpoll = Object.assign(axios, {

        contact() {
            try {
                return JSON.parse(window.localStorage.__poll__);
            }
            catch (e) {
                return null;
            }
        },

        forget() {
            try {
                window.localStorage.removeItem('__poll__');

                return true;
            }
            catch (e) {
                return false;
            }
        },
        
        headers(contact) {
            for(let [key, value] of Object.entries(contact || {})) {
                Object.assign(axios.defaults.headers, {
                    [`Contact-${key.charAt(0).toUpperCase() + key.slice(1)}`]: value
                });
            }

            return this;
        },

        remember(contact) {
            try {
                const saveData = Object.fromEntries(
                    Object.entries(contact).filter(([ key, value ]) => !!value)
                );

                window.localStorage.setItem('__poll__', JSON.stringify(saveData));

                this.headers(saveData);
                
                return true;
            }
            catch (e) {
                return false;
            }
        },

    });
    
    axios.headers(axios.contact());
}