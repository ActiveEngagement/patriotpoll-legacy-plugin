<template>
    <div class="poll" :style="styles">
        <!--
        <poll-date v-if="showDate && poll.published_at" :poll="poll" />
        -->

        <h1 v-if="poll.question" class="poll-header text-center mt-2 mb-4" v-html="poll.question" />

        <slide-deck :active="active" @enter="slide => $emit('slide-enter', slide)">
            <div key="question">
                <poll-question
                    v-model="answer"
                    :poll="poll"
                    :width="width"
                    :value="answer"
                    @convert="onConvert"
                    @submit-failed="onSubmitFailed" />
            </div>

            <div key="contact">
                <poll-form
                    ref="form"
                    :answer="answer"
                    :poll="poll"
                    :api-key="apiKey"
                    :errors="errors"
                    @convert="onConvert"
                    @cancel="onClickBack" />
            </div>

            <div key="results">
                <poll-results
                    :poll="poll"
                    :api-key="apiKey"
                    :permalink="permalink"
                    :share-buttons="shareButtons"
                    @back="onClickBack"
                    @next="poll => $emit('next', poll)" />
            </div>
        </slide-deck>
    </div>
</template>

<script>
// import PollDate from './PollDate';
import Permalink from '../../Mixins/Permalink';
import { unit } from '@vue-interface/utils';
import { SlideDeck } from '@vue-interface/slide-deck';
import { get } from '../../Helpers/URLSearchParams';

export default {

    components: {
        'poll-question': () => import(/* webpackChunkName: 'poll-question', webpackPrefetch: true */ './PollQuestion'),
        'poll-results': () => import(/* webpackChunkName: 'poll-results', webpackPrefetch: true */ './PollResults'),
        'poll-form': () => import(/* webpackChunkName: 'poll-form', webpackPrefetch: true */ './PollForm'),
        SlideDeck,
    },

    mixins: [
        Permalink
    ],

    props: {

        apiKey: String,

        showDate: {
            type: Boolean,
            default: false
        },

        maxWidth: {
            type: [Number, String],
            default: 520
        },

        poll: {
            type: Object,
            required: true
        },

        shareButtons: {
            type: Boolean,
            default: true
        },

        scrollTo: HTMLElement,

        step: [Number, String],

        width: [Number, String]

    },

    data() {     
        return {
            answer: get('answer'),
            active: this.step || (get('answer') && 'contact'),
            errors: null,
        };
    },

    computed: {

        styles() {
            return {
                width: this.width && unit(this.width),
                maxWidth: this.maxWidth && unit(this.maxWidth)
            };
        }

    },

    watch: {

        answer(value) {
            this.active = value ? 'contact' : 'question';
        },

        active(value) {
            this.$emit('step', value);

            setTimeout(() => {
                this.$refs.form && this.$refs.form.focusOnEmpty();
            }, 333);
        },

        poll() {
            this.errors = null;
            this.active = null;
        },

        step(value) {
            this.active = value;
        }

    },

    methods: {

        onConvert(poll) {
            this.$emit('convert', poll);
            this.active = 'results';
        },

        onClickBack() {
            this.answer = null;
            this.active = null;
        },

        onSubmitFailed(errors) {
            this.errors = errors;
            this.active = 'contact';
        }

    }

};
</script>
