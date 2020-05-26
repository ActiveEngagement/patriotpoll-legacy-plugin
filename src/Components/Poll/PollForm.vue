<template>
    <form @submit.prevent="onSubmit">
        <alert variant="success" class="w-100 mb-3 text-center">
            <h2 class="font-weight-light" v-html="answer" />
            <btn type="button"
                size="sm"
                variant="text"
                outline
                class="p-0"
                @click="$emit('cancel')">
                <font-awesome-icon icon="undo" class="mr-2" /> <em>Start over</em>
            </btn>
        </alert>
    
        <animate-css name="fade" in duration="250ms" leave-active-class="position-absolute">
            <div v-if="showCard" class="py-2 mx-3 mt-4 mb-5">
                <div class="d-flex">
                    <font-awesome-icon icon="user-circle" size="4x" class="text-secondary" />
                    <div class="ml-3 text-dark">
                        <h4 class="font-weight-normal mb-0" v-html="`${form.first} ${form.last}`" />
                        <h5 class="font-weight-light mb-0" v-html="form.email" />
                        <div v-if="form.street || form.city || form.state || form.zip" class="font-weight-light small mt-2">
                            {{ form.street }}
                            <template v-if="form.addr2">
                                #{{ form.addr2 }}
                            </template>
                            <br>
                            {{ form.city }} {{ form.state }} {{ form.zip }}
                            <div v-if="form.phone" class="font-weight-light" v-html="form.phone.replace(/^1?(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')" />
                        </div>
                        <a href="#" class="btn btn-text btn-sm d-flex-inline align-items-center" style="margin-left: -.5rem" @click.prevent="showCard = false">
                            <font-awesome-icon :icon="['far', 'window-close']" class="mr-2" /> <small>Change Information</small>
                        </a>
                    </div>
                </div>
            </div>
        </animate-css>

        <animate-css name="fade" in duration="250ms">
            <div v-if="!showCard" class="mb-3">
                <p><em>* Indicates the required fields.</em></p>

                <template v-for="([is, field], name) in fields">
                    <components :is="is"
                        :key="`field-${name}`"
                        :name="name"
                        :form="form"
                        :errors="errors"
                        v-bind="field" />
                </template>
            </div>
        </animate-css>
    
        <alert v-if="!poll.active" variant="danger">
            <font-awesome-icon icon="exclamation-triangle" /> This poll is not active and cannot be submitted.
        </alert>

        <btn-activity variant="primary"
            size="lg"
            block
            :activity="activity"
            :disabled="disabled">
            Submit Poll
        </btn-activity>
    </form>
</template>

<script>
import InputField from './Fields/InputField';
import SelectField from './Fields/SelectField';

import Alert from '@vue-interface/alert';
import Btn from 'vue-interface/src/Components/Btn';
// import scrollTo from 'vue-interface/src/Helpers/ScrollTo';
import SlideDeck from 'vue-interface/src/Components/SlideDeck';
import AnimateCss from 'vue-interface/src/Components/AnimateCss';
import BtnActivity from 'vue-interface/src/Components/BtnActivity';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUndo, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';

library.add(faUndo, faUserCircle, faWindowClose);

export default {

    name: 'PollForm',

    components: {
        Btn,
        Alert,
        AnimateCss,
        InputField,
        SelectField,
        BtnActivity,
        FontAwesomeIcon
    },

    props: {

        answer: [String, Number],

        poll: {
            type: Object,
            required: true
        }

    },

    data() {
        const params = new URLSearchParams(window.location.search);

        const form = Array.from(params.entries())
            .reduce((carry, [key, value]) => Object.assign({
                [key]: value
            }, carry), {
                answer: this.answer,
                query: window.location.search,
                mailing_id: params.get('mailing_id') || params.get('mailingid'),
                source: params.get('source') || params.get('src') || params.get('utm_source'),
                tracking_id: params.get('tracking_id') || params.get('trackingid')
            });

        return {
            form,
            errors: null,
            activity: false,
            showCard: false,
            showAddress: false
        };
    },

    computed: {
        disabled() {
            return Object.entries(this.fields)
                .filter(([name, [is, obj]]) => {
                    return obj.required && !this.form[name];
                })
                .length > 0;
        },
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
                state: ['select-field', {
                    label: 'State',
                    options: [{
                        1: 'Label 1'
                    }]
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
        showCard() {
            this.focusOnEmpty();
        },
        form: {
            deep: true,
            handler() {
                if(!this.showAddress) {
                    this.showAddress = this.shouldShowAddress();
                }
            }
        }
    },

    created() {
        if(window.localStorage.__poll__) {
            this.form = Object.assign(
                JSON.parse(window.localStorage.__poll__),
                this.form
            );

            this.showCard = !!(
                this.form.first && this.form.last && this.form.email
            );
        }
    },

    mounted() {
        this.showAddress = this.shouldShowAddress();
    },

    mounted() {
        setTimeout(this.focusOnEmpty, 333);
    },
    
    methods: {

        focusOnEmpty() {
            this.$nextTick(() => {
                const fields = Array.from(this.$el.querySelectorAll(
                    '.focusable input, .focusable select, .focusable textarea'
                ));

                if(fields.length) {
                    const emptyField = fields.reduce((carry, el) => {
                        return carry || !el.value && el;
                    }, null);

                    if(emptyField) {
                        emptyField.focus();
                    }
                }
            });
        },

        shouldShowAddress() {
            return this.showAddress || !!(
                this.form.first && this.form.last && this.form.email
            );
        },

        onSubmit() {
            this.activity = true;
            this.$emit('submit');

            this.$patriotpoll.post(`polls/${this.poll.id}`, this.form)
                .then(({ data }) => {
                    window.localStorage.__poll__ = JSON.stringify(this.form);

                    Object.assign(this.poll, data);
                    
                    this.poll.statistics = data.statistics;
                    this.active = 'results';
                    
                    this.$nextTick(() => {
                        this.$emit('submit-success', data);
                    });
                }, ({ response }) => {
                    this.$emit('submit-failed', this.errors = response.data.errors);
                })
                .finally(() => {
                    if(!this.poll.options.redirect_url) {
                        this.activity = false;
                    }

                    this.$emit('submit-complete');
                });
        }

    }

};
</script>
