<template>
    <div class="poll-results mt-4 p-3">
        <dounut-chart :data="poll.statistics.breakdown" :labels="labels" :height="300" />

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
import Permalink from '../../Mixins/Permalink';
import Btn from 'vue-interface/src/Components/Btn';
import Card from 'vue-interface/src/Components/Card';
import DounutChart from '../../Components/Charts/DounutChart';
import CardBody from 'vue-interface/src/Components/Card/CardBody';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLongArrowAltLeft, faLongArrowAltRight, faPoll } from '@fortawesome/free-solid-svg-icons';

library.add( faLongArrowAltLeft, faLongArrowAltRight, faPoll);

export default {

    name: 'PollResults',

    components: {
        Btn,
        DounutChart,
        FontAwesomeIcon
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

    computed: {
        
        nextPoll() {
            return this.poll.next_poll || this.poll.prev_poll;
        }

    },

    methods: {

        labels({ data: { answer, percentage } }) {
            return `${answer} (${Math.round(percentage)}%)`;
        }

    }

};
</script>