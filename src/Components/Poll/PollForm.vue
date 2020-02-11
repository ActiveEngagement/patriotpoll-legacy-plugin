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
                <font-awesome-icon icon="undo" class="mr-2" /> <em>Oops, choose another answer</em>
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
            
                <input-field
                    v-model="form.first"
                    name="first"
                    label="First Name*"
                    placeholder="First Name*"
                    class="focusable"
                    :errors="errors"
                    custom />

                <input-field
                    v-model="form.last"
                    name="last"
                    label="Last Name*"
                    placeholder="Last Name*"
                    class="focusable"
                    :errors="errors"
                    custom />

                <input-field
                    v-model="form.email"
                    name="email"
                    label="Email*"
                    placeholder="Email*"
                    class="focusable"
                    :errors="errors"
                    custom />

                <animate-css name="fade" in delay="175ms">
                    <input-field
                        v-if="showAddress"
                        v-model="form.phone"
                        name="phone"
                        class="mb-0 focusable"
                        label="Phone Number"
                        placeholder="Phone Number"
                        :errors="errors"
                        custom />
                </animate-css>

                <animate-css name="fade" in delay="350ms">
                    <div v-if="showAddress" class="mt-4">
                        <h4 class="mb-1">
                            Mailing Address
                        </h4>
                        <p><em>Your mailing address is optional.</em></p>
                        <div class="row">
                            <div class="col-sm-8">
                                <input-field v-model="form.street"
                                    name="street"
                                    label="Street Address"
                                    class="focusable"
                                    placeholder="Street Address"
                                    :errors="errors"
                                    custom />
                            </div>
                            <div class="col-sm-4">
                                <input-field v-model="form.addr2"
                                    name="addr2"
                                    label="Unit #"
                                    placeholder="Unit #"
                                    :errors="errors"
                                    custom />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">
                                <input-field v-model="form.city"
                                    name="city"
                                    label="City"
                                    class="focusable"
                                    placeholder="City"
                                    :errors="errors"
                                    custom />
                            </div>
                            <div class="col-sm-3">
                                <input-field v-model="form.state"
                                    name="state"
                                    label="State"
                                    class="focusable"
                                    placeholder="State"
                                    maxlength="2"
                                    :errors="errors"
                                    custom />
                            </div>
                            <div class="col-sm-3">
                                <input-field v-model="form.zip"
                                    name="zip"
                                    label="Zipcode"
                                    placeholder="Zipcode"
                                    class="mb-0 focusable"
                                    maxlength="5"
                                    :errors="errors"
                                    custom />
                            </div>
                        </div>
                    </div>
                </animate-css>
            </div>
        </animate-css>
    
        <alert v-if="!poll.active" variant="danger">
            <font-awesome-icon icon="exclamation-triangle" /> This poll is not active and cannot be submitted.
        </alert>

        <btn-activity variant="primary"
            size="lg"
            block
            :activity="activity"
            :disabled="!poll.active || !showAddress">
            Submit Poll
        </btn-activity>
    </form>
</template>

<script>
import Btn from 'vue-interface/src/Components/Btn';
import Alert from 'vue-interface/src/Components/Alert';
// import scrollTo from 'vue-interface/src/Helpers/ScrollTo';
import SlideDeck from 'vue-interface/src/Components/SlideDeck';
import AnimateCss from 'vue-interface/src/Components/AnimateCss';
import InputField from 'vue-interface/src/Components/InputField';
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
        return {
            form: {
                answer: this.answer
            },
            errors: null,
            activity: false,
            showCard: false,
            showAddress: false
        };
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
        this.focusOnEmpty();
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
                        // scrollTo(this.scrollTo || this.$el, 100);

                        this.$emit('submit-success', data);
                    });
                }, ({ response }) => {
                    this.$emit('submit-failed', this.errors = response.data.errors);
                })
                .finally(() => {
                    this.activity = false;
                    this.$emit('submit-complete');
                });
        }

    }

};
</script>
