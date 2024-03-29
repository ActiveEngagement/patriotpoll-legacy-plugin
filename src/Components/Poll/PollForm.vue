<template>
    <form @submit.prevent="onSubmit">
        <alert :variant="errors && errors.answer ? 'danger' : 'success'" class="w-100 mb-3">
            <h2 class="font-weight-light text-center" v-html="answer" />
            <div class="justify-content-center d-flex">
                <div v-if="errors && errors.answer" class="mr-2" v-html="errors.answer.join('<br>')" />
                <btn type="button"
                    size="sm"
                    variant="text"
                    outline
                    class="p-0"
                    @click="$emit('cancel')">
                    <font-awesome-icon icon="undo" class="mr-1" /> <em>Start over</em>
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
                    autocapitalize="off"
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

        <p v-if="poll.sponsor" class="text-center mt-2" style="font-size: .85em;">
            <em>By submitting this poll, I agree to receive updates from <a v-if="poll.sponsor.url" :href="poll.sponsor.url" target="_blank">{{ poll.sponsor.name }} <small><font-awesome-icon :icon="['fas', 'external-link-alt']" /></small></a><template v-else>{{ poll.sponsor.name }}</template></em>
        </p>
    </form>
</template>

<script>
import InputField from './Fields/InputField';
import SelectField from './Fields/SelectField';
import CanSubmit from '../../Mixins/CanSubmit';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle, faExternalLinkAlt, faUndo, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';

library.add(faUndo, faUserCircle, faWindowClose, faExclamationTriangle, faExternalLinkAlt);

export default {

    components: {
        Alert: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/alert').then(({ Alert }) => Alert),
        Btn: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/btn'),
        BtnActivity: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/btn-activity'),
        InputField,
        SelectField,
        FontAwesomeIcon: () => import(/* webpackChunkName: 'font-awesome', webpackPrefetch: true */'@fortawesome/vue-fontawesome').then(({ FontAwesomeIcon }) => FontAwesomeIcon),
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

    beforeMount() {
        this.showAddress = this.shouldShowAddress();
        this.showCard = this.shouldShowContactCard();
        this.$emit(this.shouldAutomaticallySubmit() ? 'automatic-submit': 'loaded', this);
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

                if(el && !el.value) {
                    return el.focus();
                }
            }
        },

        focusOnError() {
            const el = this.$el.querySelector('input.is-invalid, select.is-invalid, textarea.is-invalid');

            el && el.focus();
        },

        onClickReset() {
            this.showCard = false;
        },

        onSubmit() {
            this.submit(this.form)
                .catch(e => {
                    this.focusOnError();
                });
        }

    }

};
</script>
