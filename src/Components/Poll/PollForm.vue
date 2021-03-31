<template>
    <form v-visible="" @submit.prevent="submit(form)">
        <alert variant="success" class="w-100 mb-3 text-center">
            <h2 class="font-weight-light" v-html="answer" />
            <div>
                <btn type="button"
                    size="sm"
                    variant="text"
                    outline
                    class="p-0"
                    @click="$emit('cancel')">
                    <font-awesome-icon icon="undo" class="mr-2" /> <em>Start over</em>
                </btn>
            </div>
        </alert>
    
        <div v-if="showCard" class="py-2 mx-3 mt-4 mb-5">
            <div class="d-flex">
                <font-awesome-icon icon="user-circle" size="4x" class="text-secondary" />
                <div class="ml-3 text-dark">
                    <h4 class="font-weight-normal mb-0">
                        {{ form.first }} {{ form.last }}
                    </h4>
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
                    <a href="#" class="btn btn-text btn-sm d-flex-inline align-items-center" style="margin-left: -.5rem" @click.prevent="onClickReset">
                        <font-awesome-icon :icon="['far', 'window-close']" class="mr-2" /> <small>Change Information</small>
                    </a>
                </div>
            </div>
        </div>

        <div v-if="!showCard" class="mb-3">
            <p><em>* Indicates the required fields.</em></p>

            <template v-for="([is, field], name) in fields">
                <components :is="is"
                    :key="`field-${name}`"
                    v-model="form[name]"
                    :name="name"
                    :errors="errors"
                    :value="form[name]"
                    v-bind="field"
                    custom />
            </template>
        </div>
    
        <alert v-if="!poll.active" variant="danger">
            <font-awesome-icon icon="exclamation-triangle" /> This poll is not active and cannot be submitted.
        </alert>

        <btn-activity
            v-else
            type="submit"
            variant="primary"
            size="lg"
            block
            indicator="dots"
            :activity="activity"
            :disabled="isDisabled()">
            Submit Poll
        </btn-activity>

        <p v-if="poll.sponsor" class="text-center mt-2">
            <small><em>By submitting this poll, I agree to receive updates from <a v-if="poll.sponsor.url" :href="poll.sponsor.url">{{ poll.sponsor.name }}</a><template v-else>{{ poll.sponsor.name }}</template>.</em></small>
        </p>
    </form>
</template>

<script>

import { Alert } from '@vue-interface/alert';
// import AnimateCss from '@vue-interface/animate-css';
import Btn from '@vue-interface/btn';
import BtnActivity from '@vue-interface/btn-activity';
import CanSubmit from '../../Mixins/CanSubmit';
import InputField from './Fields/InputField';
import SelectField from './Fields/SelectField';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle, faUndo, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';
import { entries, get } from '../../Helpers/URLSearchParams';

library.add(faUndo, faUserCircle, faWindowClose, faExclamationTriangle);

export default {

    components: {
        Alert,
        // AnimateCss,
        Btn,
        BtnActivity,
        FontAwesomeIcon,
        InputField,
        SelectField,
    },

    mixins: [
        CanSubmit
    ],

    props: {

        answer: [String, Number],

        poll: {
            type: Object,
            required: true
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

    mounted() {      
        this.showAddress = this.shouldShowAddress();
        this.showCard = this.shouldShowContactCard();
    },
    
    methods: {

        focusOnEmpty() {            
            // Get the array of fields and sort them be required.
            // Doing so will focus on the first empty required field,
            // or then the first empty actual field, if all required fields
            // have been populated.
            const fields = Object.entries(this.fields)
                .sort(([x, [xKey, a]], [y, [yKey, b]]) => {
                    if(a.required && b.required) {
                        return 0;
                    }

                    if(a.required) {
                        return -1;
                    }
            
                    return 1;
                });

            for(const [name, field] of fields) {
                const el = this.$el.querySelector(`[name=${name}]`);

                if(!el.value) {
                    return el.focus();
                }
            }

            this.$el.querySelector('[type=submit]').focus();
        },

        onClickReset() {
            this.$patriotpoll.forget();
            this.showCard = false;
        }

    }

};
</script>
