<template>
    <form @submit.prevent="onSubmit">
        <alert variant="success" class="w-100 my-3 text-center">
            <h2 class="font-weight-light" v-html="answer" />
            <btn type="button"
                size="sm"
                variant="text"
                outline
                class="p-0"
                @click="$emit('cancel')">
                <icon icon="undo" class="mr-2" /> <em>Oops, choose another answer</em>
            </btn>
        </alert>
    
        <animate-css name="fade" in duration="250ms" leave-active-class="position-absolute">
            <div v-if="showCard" class="py-2 mx-3 mt-4 mb-5">
                <div class="d-flex">
                    <icon icon="user-circle" size="4x" class="text-secondary" />
                    <div class="ml-3 text-dark">
                        <h4 class="font-weight-normal mb-0" v-html="`${form.first} ${form.last}`" />
                        <h5 class="font-weight-light mb-1" v-html="form.email" />
                        <div v-if="form.street || form.city || form.state || form.zip" class="font-weight-light small mt-1">
                            {{ form.street }}
                            <template v-if="form.addr2">
                                #{{ form.addr2 }}
                            </template>
                            <br>
                            {{ form.city }} {{ form.state }} {{ form.zip }}
                            <div v-if="form.phone" class="font-weight-light" v-html="form.phone.replace(/^1?(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')" />
                        </div>
                    </div>
                </div>
                <div class="ml-5 pl-4">
                    <a href="#" class="btn btn-text btn-sm d-flex-inline align-items-center" @click.prevent="showCard = false">
                        <icon :icon="['far', 'window-close']" class="mr-2" /> <small>Change Information</small>
                    </a>
                </div>
            </div>
        </animate-css>

        <animate-css name="fade" in duration="250ms">
            <div v-if="!showCard">
                <p><em>* Indicates the required fields.</em></p>

                <input-field
                    v-model="form.first"
                    name="first"
                    label="First Name*"
                    placeholder="First Name*"
                    :errors="errors"
                    custom />

                <input-field
                    v-model="form.last"
                    name="last"
                    label="Last Name*"
                    placeholder="Last Name*"
                    :errors="errors"
                    custom />

                <input-field
                    v-model="form.email"
                    name="email"
                    label="Email*"
                    placeholder="Email*"
                    :errors="errors"
                    custom />

                <animate-css name="fade" in delay="250ms">
                    <input-field
                        v-if="showAddress"
                        v-model="form.phone"
                        name="phone"
                        class="mb-0"
                        label="Phone Number"
                        placeholder="Phone Number"
                        :errors="errors"
                        custom />
                </animate-css>

                <animate-css name="fade" in delay="500ms">
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
                                    placeholder="City"
                                    :errors="errors"
                                    custom />
                            </div>
                            <div class="col-sm-3">
                                <input-field v-model="form.state"
                                    name="state"
                                    label="State"
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
                                    class="mb-0"
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
            <icon icon="exclamation-triangle" /> This poll is not active and cannot be submitted.
        </alert>

        <btn-activity variant="primary"
            size="lg"
            class="mt-3"
            block
            :activity="activity"
            :disabled="!poll.active || !showAddress">
            Submit Poll
        </btn-activity>
    </form>
</template>

<script>
import PatriotPoll from '../../Mixins/PatriotPoll';

import Btn from 'vue-interface/src/Components/Btn';
import Alert from 'vue-interface/src/Components/Alert';
import scrollTo from 'vue-interface/src/Helpers/ScrollTo';
import SlideDeck from 'vue-interface/src/Components/SlideDeck';
import AnimateCss from 'vue-interface/src/Components/AnimateCss';
import InputField from 'vue-interface/src/Components/InputField';
import BtnActivity from 'vue-interface/src/Components/BtnActivity';

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
    },

    mixins: [
        PatriotPoll
    ],

    props: {

        answer: [String, Number],

        apiKey: {
            type: String,
            required: true
        },

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

    methods: {

        shouldShowAddress() {
            return this.showAddress || !!(
                this.form.first && this.form.last && this.form.email
            );
        },

        onSubmit() {
            this.activity = true;
            this.$emit('submit');

            this.$patriotpoll.post(`polls/${this.poll.id}`, this.form, {
                headers: {
                    Authorization: 'Bearer ' + this.apiKey
                }
            })
                .then(({ data }) => {
                    window.localStorage.__poll__ = JSON.stringify(this.form);

                    this.poll.statistics = data.statistics;
                    this.active = 'results';
                    
                    this.$nextTick(() => {
                        scrollTo(this.scrollTo || this.$el, 100);

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
