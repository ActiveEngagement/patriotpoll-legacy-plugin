<script>
import Axios from 'axios';

export const BASE_URL = 'https://api.patriotpoll.net/v1';

export default {

    props: {

        baseUrl: {
            type: String,
            default() {
                return process.env.VUE_APP_PATRIOT_POLL_BASE_URL || BASE_URL;
            }
        },

        apiKey: {
            type: String,
            default() {
                return process.env.VUE_APP_PATRIOT_POLL_API_KEY;
            }
        }
        
    },
    
    created() {
        this.$patriotpoll = Axios.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.apiKey && `Bearer ${this.apiKey}`
            }
        });
    }

};
</script>