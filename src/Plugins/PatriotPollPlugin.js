import Axios from 'axios';
import filter from '../Helpers/filter';
import { get, source } from '../Helpers/URLSearchParams';

export const BASE_URL = 'https://api.patriotpoll.net/v1';

export default function(Vue, options = {}) {
    // If Axios is not installed, throw an error
    if(!Axios) {
        throw new Error('Axios is a required external dependency. Make sure its available in the global scope.');
    }

    // The scope for the instance.
    const scope = {};

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
        headers: filter({
            Authorization: apiKey && `Bearer ${apiKey}`,
            Source: source(),
            Href: window.location.href,
        })
    });

    let sessionId;
    
    Vue.prototype.$patriotpoll = Object.assign(axios, {

        async mounted(vue) {
            if(!this.contact() && get('contact')) {
                const { data } = await this.get(`contact/${get('contact')}`);

                scope.contact = data;
            }
    
            axios.headers(this.contact());
        },

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
        
        headers(contact, headers) {
            for(let [key, value] of Object.entries(contact || {})) {
                Object.assign(headers || axios.defaults.headers, {
                    [`Contact-${key.charAt(0).toUpperCase() + key.slice(1)}`]: value
                });
            }

            return this;
        },

        remember(contact) {
            try {
                const saveData = filter(contact);

                window.localStorage.setItem('__poll__', JSON.stringify(saveData));

                this.headers(saveData);
                
                return true;
            }
            catch (e) {
                return false;
            }
        },

    });
    
    // Set the default headers with last known contact
    axios.headers(axios.contact());

    /**
     * Do NOT remove the session interceptors!
     */
    axios.interceptors.request.use(config => {
        // Set the existing session to the request headers
        if(sessionId) {
            config.headers['session-id'] = sessionId;
        }
        
        // Set the existing contact to the request headers. This is important
        // if the contact info changes from the default.
        axios.headers(axios.contact(), config.headers);

        return config;
    });

    axios.interceptors.response.use(response => {
        // Store the last known session ID in memory
        if(!sessionId) {
            sessionId = response.headers['session-id'];
        }

        return response;
    });
}