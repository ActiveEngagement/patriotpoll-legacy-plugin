<template>
    <card class="poll-card">
        <card-header>{{ poll.published_at | date('MMMM D, YYYY') }}</card-header>
        <card-body>
            <card-title v-if="poll.question || poll.title" v-html="poll.question || poll.title" />
            <div v-else-if="poll.html" v-html="poll.html" />
            <img v-if="image" :src="image.url" class="img-fluid poll-img">
            <template v-if="poll.statistics">
                <progress-bar v-for="(breakdown, answer) in poll.statistics.breakdown" :key="answer" :value="breakdown.percentage" :color="color()" :class="{'text-dark': breakdown.percentage === 0}">
                    {{ answer }} ({{ breakdown.total }})
                </progress-bar>
            </template>
            <!--<dounut-chart :data="poll.statistics.breakdown" />-->
        </card-body>
        <card-footer>
            <div class="icon social fb">
                <icon :icon="['fab', 'facebook']" />
            </div>
            <div class="icon social tw">
                <icon :icon="['fab', 'twitter']" />
            </div>
            <div class="icon social em">
                <icon icon="envelope" />
            </div>
        </card-footer>
    </card>
</template>

<script>
import randomcolor from 'randomcolor';
import Card from 'vue-interface/src/Components/Card';
import { DateFilter } from 'vue-interface/src/Filters/Date';
import CardBody from 'vue-interface/src/Components/Card/CardBody';
import ProgressBar from 'vue-interface/src/Components/ProgressBar';
import CardTitle from 'vue-interface/src/Components/Card/CardTitle';
import CardHeader from 'vue-interface/src/Components/Card/CardHeader';
import CardFooter from 'vue-interface/src/Components/Card/CardFooter';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

library.add(faTwitter);
library.add(faFacebook);
library.add(faEnvelope);

export default {

    name: 'PollCard',

    components: {
        Card,
        CardBody,
        CardTitle,
        CardHeader,
        CardFooter,
        ProgressBar,
        //DounutChart
    },

    filters: {
        'date': DateFilter
    },

    props: {

        poll: {
            type: Object,
            required: true
        }

    },

    computed: {

        image() {
            return this.poll.embed;
        }

    },

    methods: {
        color(options) {
            return randomcolor(Object.assign({
                count: 1,
                luminosity: 'dark'
            }, options))[0];
        }
    }

};
</script>
