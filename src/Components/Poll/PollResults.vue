<template>
    <div class="poll-results mt-4 p-3">
        <poll-doughnut-chart v-if="mounted" :poll="poll" />

        <poll-social-buttons v-if="shareButtons" :poll="poll" />

        <next-poll :poll="poll" :permalink="permalink" />
    </div>
</template>

<script>
import Permalink from '../../Mixins/Permalink';
import NextPoll from './NextPoll';

export default {

    name: 'PollResults',

    components: {
        NextPoll,
        PollDoughnutChart: () => import(/* webpackChunkName: 'poll-doughnut-chart' */'./PollDoughnutChart'),
        PollSocialButtons: () => import(/* webpackChunkName: 'poll-social-buttons' */'./PollSocialButtons'),
    },

    mixins: [
        Permalink
    ],

    props: {

        poll: {
            type: Object,
            required: true
        },

        shareButtons: {
            type: Boolean,
            default: true
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