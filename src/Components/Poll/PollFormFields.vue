<template>
    <div>
        <alert variant="success" class="w-100 my-3 text-center">
            <h2 class="font-weight-light" v-html="form.answer" />
            <btn type="button"
                size="sm"
                variant="text"
                outline
                class="p-0"
                @click="$emit('cancel')">
                <icon icon="undo" class="mr-2" /> <em>Oops, choose another answer</em>
            </btn>
        </alert>
        
        <card>
            <card-body>
                <card-title>Tell us who you are</card-title>
                <card-subtitle><p><em>* Indicates the required fields.</em></p></card-subtitle>
                <input-field v-model="form.first"
                    name="first"
                    label="First Name*"
                    placeholder="First Name*"
                    :errors="errors"
                    custom />
                <input-field v-model="form.last"
                    name="last"
                    label="Last Name*"
                    placeholder="Last Name*"
                    :errors="errors"
                    custom />
                <input-field v-model="form.email"
                    name="email"
                    label="Email*"
                    placeholder="Email*"
                    :errors="errors"
                    custom />
                <input-field v-model="form.phone"
                    name="phone"
                    label="Phone Number"
                    placeholder="Phone Number"
                    help-text="Either an email or a phone is required."
                    class="mb-0"
                    :errors="errors"
                    custom />
            </card-body>
        </card>

        <transition name="fade">
            <card v-show="shouldShowAddress" key="address" class="mt-3">
                <card-body>
                    <card-title>Mailing Address</card-title>
                    <card-subtitle><p><em>Your mailing address is optional.</em></p></card-subtitle>
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
                </card-body>
            </card>
        </transition>

        <alert v-if="!poll.active" variant="danger">
            <icon icon="exclamation-triangle" /> This poll is not active and cannot be submitted.
        </alert>

        <btn-activity variant="primary"
            size="lg"
            class="mt-3"
            block
            :activity="activity"
            :disabled="!poll.active || !shouldShowAddress">
            Submit Poll
        </btn-activity>
    </div>
</template>

<script>
import Btn from 'vue-interface/src/Components/Btn';
import Card from 'vue-interface/src/Components/Card';
import Alert from 'vue-interface/src/Components/Alert';
import InputField from 'vue-interface/src/Components/InputField';
import CardBody from 'vue-interface/src/Components/Card/CardBody';
import BtnActivity from 'vue-interface/src/Components/BtnActivity';
import CardTitle from 'vue-interface/src/Components/Card/CardTitle';
import CardSubtitle from 'vue-interface/src/Components/Card/CardSubtitle';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';

library.add(faUndo);

export default {

    name: 'PollFormFields',

    components: {
        Btn,
        Card,
        Alert,
        CardBody,
        CardTitle,
        InputField,
        BtnActivity,
        CardSubtitle
    },

    props: {

        activity: {
            type: Boolean,
            default: false
        },

        form: {
            type: Object,
            required: true
        },

        errors: {
            type: Object,
            default() {
                return {};
            }
        },

        poll: {
            type: Object,
            required: true
        }

    },

    data() {
        return {
            hasShownAddress: this.shouldShowAddress
        };
    },

    computed: {

        shouldShowAddress() {
            return this.hasShownAddress || (this.form.first && this.form.last && (
                this.form.email || this.form.phone
            ));
        }

    },

    watch: {
        
        shouldShowAddress(value) {
            if(!this.hasShownAddress) {
                this.hasShownAddress = value;
            }
        }

    }

};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';
@import '../../assets/scss/variables';
@import '~bootstrap/scss/_functions.scss';
@import '~bootstrap/scss/_variables.scss';
@import '~vue-interface/src/scss/custom-fields.scss';

.poll-date {
    @include body-font;
    background-color: transparent;
    color: $primary-red;
    font-size: 15px;
    text-transform: uppercase;
    text-align: center;
    font-weight: 700;
    letter-spacing: 1px;
}
</style>