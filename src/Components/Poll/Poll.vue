<template>
    <div class="poll">
        <poll-date :poll="poll" />

        <h1 v-if="poll.question" class="poll-header font-weight-light text-center mt-2" v-html="poll.question" />

        <slide-deck :active="active" @enter="slide => $emit('slide-enter', slide)">
            <div key="question">
                <poll-question :poll="poll" @input="onSelectAnswer" />
            </div>

            <div key="contact">
                <poll-form :answer="answer" :poll="poll" :api-key="apiKey" @submit-success="active = 'results'" @cancel="onClickBack" />
            </div>

            <div key="results">
                <poll-results :poll="poll" :api-key="apiKey" @back="onClickBack" @next="poll => $emit('next', poll)" />
            </div>
        </slide-deck>
    </div>
</template>

<script>
import PollDate from './PollDate';
import PollForm from './PollForm';
import PollResults from './PollResults';
import PollQuestion from './PollQuestion';

import scrollTo from 'vue-interface/src/Helpers/ScrollTo';
import SlideDeck from 'vue-interface/src/Components/SlideDeck';

export default {

    name: 'Poll',

    components: {
        PollDate,
        PollResults,
        PollQuestion,
        PollForm,
        SlideDeck
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

        scrollTo: {
            type: [HTMLElement]
        },

        step: [Number, String]

    },

    data() {        
        return {
            answer: null,
            active: this.step || null
        };
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
            scrollTo(this.scrollTo || this.$el, 100);

            this.$nextTick(() => {
                this.active = null;
                this.answer = null;
            });
        },

        onSelectAnswer(value) {
            this.answer = value;
            this.active = 'contact';

            this.$nextTick(() => {
                scrollTo(this.scrollTo || this.$el, 100);
            });
        }

    }

};
</script>
