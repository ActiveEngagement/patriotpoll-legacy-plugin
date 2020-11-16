<template>
    <div class="poll" :style="styles">
        <poll-date v-if="!hideDate" :poll="poll" />

        <h1 v-if="poll.question" class="poll-header text-center mt-2 mb-4" v-html="poll.question" />

        <slide-deck :active="active" @enter="slide => $emit('slide-enter', slide)">
            <div key="question">
                <poll-question :poll="poll" :width="width" @input="onSelectAnswer" />
            </div>

            <div key="contact">
                <poll-form :answer="answer" :poll="poll" :api-key="apiKey" @submit-success="onSubmitSuccess" @cancel="onClickBack" />
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
import PollDate from './PollDate';
import Permalink from '../../Mixins/Permalink';
import { unit } from '@vue-interface/utils';
import { SlideDeck } from '@vue-interface/slide-deck';

export default {

    name: 'Poll',

    components: {
        PollDate,
        SlideDeck,
        'poll-question': () => import(/* webpackChunkName: 'poll-question' */ './PollQuestion'),
        'poll-results': () => import(/* webpackChunkName: 'poll-results' */ './PollResults'),
        'poll-form': () => import(/* webpackChunkName: 'poll-form' */ './PollForm')
    },

    mixins: [
        Permalink
    ],

    props: {

        apiKey: String,

        hideDate: {
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

        width: Number

    },

    data() {      
        const params = new URLSearchParams(window.location.search);
        const answer = params.get('answer');

        return {
            answer,
            active: this.step || (answer && 'contact')
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

        active(value) {
            this.$emit('step', value);
        },

        poll(value) {
            this.errors = null;
            this.active = null;
        },

        step(value) {
            this.active = value;
        }

    },

    methods: {

        onSubmitSuccess() {
            if(!this.poll.options.redirect_url) {
                this.active = 'results';
            }
            else {
                window.location = this.poll.options.redirect_url;
            }
        },

        onClickBack() {
            // scrollTo(this.scrollTo || this.$el, 100);

            this.$nextTick(() => {
                this.active = null;
                this.answer = null;
            });
        },

        onSelectAnswer(value) {
            this.answer = value;
            this.active = 'contact';

            /*
            this.$nextTick(() => {
                scrollTo(this.scrollTo || this.$el, 100);
            });
            */
        }

    }

};
</script>
