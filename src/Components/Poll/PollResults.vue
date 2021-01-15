<template>
    <div class="poll-results mt-4 p-3">
        <poll-doughnut-chart v-if="mounted" :poll="poll" />

        <poll-social-buttons v-if="shareButtons" :poll="poll" />

        <next-poll v-if="nextPoll" :poll="poll" :permalink="permalink" />
    </div>
</template>

<script>
import Permalink from '../../Mixins/Permalink';
import NextPoll from './NextPoll';

export default {

    name: 'PollResults',

    components: {
        NextPoll,
        PollDoughnutChart: () => import(/* webpackChunkName: 'poll-doughnut-chart', webpackPrefetch: true */'./PollDoughnutChart'),
        PollSocialButtons: () => import(/* webpackChunkName: 'poll-social-buttons', webpackPrefetch: true */'./PollSocialButtons'),
    },

    mixins: [
        Permalink
    ],

    props: {

        poll: {
            type: Object,
            required: true
        },

        nextPoll: {
            type: Boolean,
            default() {
                return !!this.$patriotpoll;
            }
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