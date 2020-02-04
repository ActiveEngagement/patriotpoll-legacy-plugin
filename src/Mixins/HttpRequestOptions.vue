<script>
let baseURL = null;

switch(process.env.NODE_ENV) {
    case 'staging':
        baseURL = 'https://dev5.giveworks.net/api/public/v1';
        break;
    case 'production':
        baseURL = 'https://secure.giveworks.net/api/public/v1';
        break;
    case 'development':
    default:
        baseURL = 'https://giveworks.test/api/public/v1';
        break;
}

export default {

    props: {

        apiKey: {
            type: String,
            required: true
        }

    },

    computed: {

        httpRequestOptions() {
            return {
                baseURL: baseURL,
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            };
        }

    }
}
</script>
