<template>
    <base-form
        :data="form"
        :model="model"
        :headers="headers"
        :request="request"
        class="poll-form"
        @submit="onSubmit"
        @submit-failed="onSubmitFailed"
        @submit-complete="onSubmitComplete"
        @submit-success="onSubmitSuccess">
        <poll-date :poll="poll" />

        <h2 v-if="poll.question" class="poll-header" v-html="poll.question" />

        <slide-deck :active="active" @enter="onSlideEnter">
            <div key="question">
                <poll-question v-model="form.answer" :poll="poll" :value="form.active" @input="onSelectAnswer" />
            </div>

            <div key="contact">
                <poll-form-fields :activity="activity" :errors="errors" :form="form" :poll="poll" @cancel="onClickCancel" />
            </div>

            <div key="results">
                <poll-results :poll="poll" :api-key="apiKey" @back="onClickBack" @next="poll => $emit('next', poll)" />
            </div>
        </slide-deck>
    </base-form>
</template>

<script>
import scrollTo from 'vue-interface/src/Helpers/ScrollTo';
import BaseForm from 'vue-interface/src/Components/BaseForm';
import SlideDeck from 'vue-interface/src/Components/SlideDeck';

import PollDate from './PollDate';
import Poll from '../../Models/Poll';
import PollResults from './PollResults';
import PollQuestion from './PollQuestion';
import PollFormFields from './PollFormFields';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPoll } from '@fortawesome/free-solid-svg-icons/faPoll';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { setTimeout } from 'timers';

library.add(faPoll);
library.add(faTimesCircle);
library.add(faExclamationTriangle);

export default {

    name: 'PollForm',

    components: {
        BaseForm,
        PollDate,
        SlideDeck,
        PollResults,
        PollQuestion,
        PollFormFields,
    },

    props: {

        apiKey: {
            type: String,
            required: true
        },

        poll: {
            type: Object,
            required: true
        },

        request: {
            type: Object,
            default() {
                return {};
            }
        },
        
        scrollTo: {
            type: [HTMLElement]
        },

        step: {
            type: [Number, String],
            default() {
                return 'question';
            }
        }

    },

    data() {
        return {
            model: new Poll({
                id: this.poll.id
            }),
            form: {
                answer: null
            },
            errors: null,
            loading: true,
            activity: false,
            active: this.step
        };
    },

    computed: {

        headers() {
            return {
                Authorization: 'Bearer ' + this.apiKey
            };
        }

    },

    watch: {

        active(value) {
            this.$emit('step', value);
        },

        step(value) {
            this.active = value;
        },

        poll(value) {
            this.errors = null;
            this.activity = false;
            this.active = 'question';
            this.model = new Poll(value);
            this.form = this.model.toJSON();
        }

    },

    mounted() {
        if(window.localStorage.__poll__) {
            this.form = Object.assign(
                JSON.parse(window.localStorage.__poll__), {
                    answer: null
                }
            );
        }
    },

    methods: {

        onClickBack() {
            scrollTo(this.scrollTo || this.$el, 100);

            this.$nextTick(() => {
                this.form.answer = null;
                this.active = 'question';
            });
        },

        onClickCancel() {
            this.onClickBack();
        },

        onSelectAnswer() {
            this.active = 'contact';

            this.$nextTick(() => {
                scrollTo(this.scrollTo || this.$el, 100);
            });
        },

        onSlideEnter(slide) {
            this.$emit('slide-enter', slide);
        },

        onSubmit() {
            this.activity = true;
        },

        onSubmitSuccess(event, response) {
            window.localStorage.__poll__ = JSON.stringify(this.form);

            this.poll.statistics = response.get('statistics');
            this.active = 'results';
            this.form.answer = null;
            
            this.$nextTick(() => {
                scrollTo(this.scrollTo || this.$el, 100);
            });
        },

        onSubmitComplete(event, success, response) {
            this.activity = false;
        },

        onSubmitFailed(event, response) {
            this.errors = response.data;
        }

    }

};
</script>
