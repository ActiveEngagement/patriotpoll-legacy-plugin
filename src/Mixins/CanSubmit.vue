<script>
let lastSubmit = null;

export default {

    data() {
        return {
            activity: false,
            contact: lastSubmit && this.loadContact(),
            errors: null,
        };
    },

    methods: {

        loadContact() {
            try {
                return JSON.parse(window.localStorage.__poll__);
            }
            catch (e) {
                return null;
            }
        },

        saveContact(contact) {
            const saveData = Object.entries(contact)
                .filter(([ key, value ]) => !!value)
                .reduce((carry, [ key, value ]) => {
                    return Object.assign(carry, { [key]: value });
                }, {});
                        
            // We need this try/catch here for browsers that block cookies.
            try {
                window.localStorage.__poll__ = JSON.stringify(saveData);

                this.contact = saveData;
            }
            catch (e) {
                window.localStorage.removeItem('__poll__');
                
                this.contact = null;
            }
        },

        submit(form = {}) {
            this.$emit('submit');

            return this.$patriotpoll.post(`polls/${this.poll.id}`, Object.assign({}, this.loadContact(), form))
                .then(({ data }) => {
                    this.saveContact(data.response.contact);

                    Object.assign(this.poll, data, {
                        statistics: data.statistics
                    });

                    this.$emit('convert', data);
                    this.$emit('submit-success', data);
                    
                    lastSubmit = new Date;
                }, e => {
                    this.errors = e.response
                        && e.response.data
                        && e.response.data.errors;

                    if(this.errors) {
                        this.$emit('submit-failed', this.errors);

                        return;
                    }
                })
                .finally(() => {
                    this.activity = false;
                    this.$emit('submit-complete');                    
                });
        }
    }
};
</script>