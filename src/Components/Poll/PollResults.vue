<template>
    <div class="poll-results mt-4 p-3">
        <poll-doughnut-chart v-if="mounted" :poll="poll" />
        
        <div v-if="$slots['results-after-chart']" class="mt-3">
            <slot name="results-after-chart" />
        </div>

        <poll-social-buttons v-if="shareButtons" :poll="poll">
            <slot name="results-after-social-buttons" />
        </poll-social-buttons>

        <next-poll v-if="nextPoll" :poll="poll" :permalink="permalink" @click.native="$emit('next')">
            <slot name="results-after-next-poll" />
        </next-poll>
    </div>
</template>

<script>
import Permalink from '../../Mixins/Permalink';
import NextPoll from './NextPoll';

export default {

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