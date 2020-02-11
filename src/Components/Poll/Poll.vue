<template>
    <div class="poll" :style="styles">
        <poll-date :poll="poll" />

        <h1 v-if="poll.question" class="poll-header font-weight-light text-center mt-2 mb-4" v-html="poll.question" />

        <slide-deck :active="active" @enter="slide => $emit('slide-enter', slide)">
            <div key="question">
                <poll-question :poll="poll" :width="width" @input="onSelectAnswer" />
            </div>

            <div key="contact">
                <poll-form :answer="answer" :poll="poll" :api-key="apiKey" @submit-success="active = 'results'" @cancel="onClickBack" />
            </div>

            <div key="results">
                <poll-results :poll="poll" :api-key="apiKey" :permalink="permalink" @back="onClickBack" @next="poll => $emit('next', poll)" />
            </div>
        </slide-deck>
    </div>
</template>

<script>
import SlideDeck from 'vue-interface/src/Components/SlideDeck';
import Permalink from '../../Mixins/Permalink';
import PollDate from './PollDate';
import PollForm from './PollForm';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';
import unit from 'vue-interface/src/Helpers/Functions/unit';

export default {

    name: 'Poll',

    components: {
        PollDate,
        PollResults,
        PollQuestion,
        PollForm,
        SlideDeck
    },

    mixins: [
        Permalink
    ],

    props: {

        apiKey: String,

        maxWidth: {
            type: [Number, String],
            default: 520
        },

        poll: {
            type: Object,
            required: true
        },

        scrollTo: HTMLElement,

        step: [Number, String],

        width: Number,

    },

    data() {        
        return {
            answer: null,
            active: this.step || null
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
