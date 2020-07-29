<template>
    <div class="poll-results mt-4 p-3">
        <poll-doughnut-chart v-if="mounted" :poll="poll" />

        <poll-social-buttons :poll="poll" />

        <div v-if="nextPoll" class="mt-5 mb-3 mx-3">
            <h4 class="mb-2">
                Next Up...
            </h4>
            <h3 v-if="nextPoll.question" class="mb-4 font-weight-light" v-html="nextPoll.question" />
            <btn
                v-permalink.native="nextPoll"
                :redirect="poll.options.redirect_url"
                type="button"
                size="lg"
                variant="success"
                class="d-inline-flex justify-content-center align-items-center"
                block>
                <font-awesome-icon icon="poll" size="2x" class="mr-3" /> Take Next Poll
                <font-awesome-icon icon="long-arrow-alt-right" size="2x" class="ml-3" />
            </btn>
        </div>
    </div>
</template>

<script>
import Btn from '@vue-interface/btn';
import Permalink from '../../Mixins/Permalink';
import PollSocialButtons from './PollSocialButtons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLongArrowAltLeft, faLongArrowAltRight, faPoll } from '@fortawesome/free-solid-svg-icons';

library.add( faLongArrowAltLeft, faLongArrowAltRight, faPoll);

export default {

    name: 'PollResults',

    components: {
        Btn,
        FontAwesomeIcon,
        PollSocialButtons,
        PollDoughnutChart: () => import(/* webpackChunkName: 'poll-doughnut-chart' */'./PollDoughnutChart'),
    },

    mixins: [
        Permalink   
    ],

    props: {

        apiKey: String,

        poll: {
            type: Object,
            required: true
        }

    },

    data() {
        return {
            mounted: false
        };
    },

    computed: {

        nextPoll() {
            return this.poll.next_poll || this.poll.prev_poll;
        }

    },

    mounted() {
        setTimeout(() => this.mounted = true, 250);
    },

    methods: {

        labels({ data: { answer, percentage } }) {
            return `${answer} (${Math.round(percentage)}%)`;
        }

    }

};
</script>