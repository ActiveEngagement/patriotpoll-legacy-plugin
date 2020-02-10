<script>
import Axios from 'axios';

export const BASE_URL = 'https://api.patriotpoll.net/v1';

export const axios = Axios.create({
    baseURL: process.env.VUE_APP_BASE_URL || BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.VUE_APP_API_KEY}`
    }
});

export default {
    
    created() {
        this.$patriotpoll = axios;
    }

};
</script>