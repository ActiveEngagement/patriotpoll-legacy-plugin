<script>
import filter from '../Helpers/filter';
import { toJson, get, mailingId, source, trackingId } from '../Helpers/URLSearchParams';

let lastSubmit;

export default {

    data() {
        return {
            activity: false,
            contact: this.$patriotpoll.contact(),
            errors: this.$attrs.errors || null,
            form: this.formData(),
            lastSubmit,
            showAddress: false,
            showCard: false,
        };
    },

    computed: {
        fields() {
            const entries = Object.entries({
                first: ['input-field', {
                    label: 'First Name'
                }],
                last: ['input-field', {
                    label: 'Last Name'
                }],
                email: ['input-field', {
                    label: 'Email Address'
                }],
                phone: ['input-field', {
                    label: 'Phone Number'
                }],
                street: ['input-field', {
                    label: 'Street'
                }],
                addr2: ['input-field', {
                    label: 'Unit #'
                }],
                city: ['input-field', {
                    label: 'City'
                }],
                zip: ['input-field', {
                    label: 'Postal Code',
                    maxlength: 5
                }]
            })
                .map(([key, [is, obj]]) => {
                    obj.required = this.poll.options.required_fields && 
                        this.poll.options.required_fields[key];

                    return [key, [is, obj]];
                })
                .filter(([key, value]) => {
                    return this.poll.options.show_fields &&
                        this.poll.options.show_fields[key];
                });

            return Object.fromEntries(entries);
        }
    },

    watch: {
        answer(value) {
            this.form.answer = value;
        }
    },

    mounted() {
        if(this.shouldAutomaticallySubmit()) {
            this.$emit('automatic-submit', this);
        }
    },

    methods: {

        formData() {
            return filter(toJson(), this.$patriotpoll.contact(), {
                answer: this.answer,
                query: window.location.search,
                mailing_id: mailingId(),
                source: source(),
                tracking_id: trackingId()
            });
        },
        
        isDisabled() {
            return Object.entries(this.fields)
                .filter(([name, [is, obj]]) => {
                    return obj.required && !this.form[name];
                })
                .length > 0;
        },

        shouldShowContactCard() {
            return !!(this.contact && this.contact.hash) && !this.isDisabled();
        },

        shouldAutomaticallySubmit() {
            const key = get('submit');

            return !this.isDisabled() && key && key.toLowerCase() === 'true';
        },

        shouldShowAddress() {
            return this.showAddress || !!(
                this.form.first && this.form.last && this.form.email
            );
        },

        submit(form = {}) {
            this.activity = true;
            this.$emit('submit');

            form = Object.assign({}, this.$patriotpoll.contact(), form);

            return this.$patriotpoll.post(`polls/${this.poll.id}`, form)
                .then(({ data }) => {
                    this.$patriotpoll.remember(data.response.contact);

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
                    }
                    
                    throw e;
                })
                .finally(() => {
                    this.activity = false;
                    this.$emit('submit-complete');                    
                });
        }
    },
};
</script>