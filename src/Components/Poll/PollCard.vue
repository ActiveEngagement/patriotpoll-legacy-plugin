<template>
    <card class="poll-card">
        <card-header>{{ poll.published_at | date('MMMM D, YYYY') }}</card-header>
        <card-body>
            <a :href="poll.permalink">
                <card-title v-if="poll.question || poll.title" v-html="poll.question || poll.title" />
                <div v-else-if="poll.html" v-html="poll.html" />
                <div style="" :style="{'background': `url(${poll.image.url}) center / cover no-repeat`, height: '12rem'}" />
                <img v-if="poll.embed" :src="poll.embed.url" class="img-fluid poll-img">
            </a>
            <template v-if="poll.statistics">
                <progress-bar v-for="(breakdown, answer) in poll.statistics.breakdown" :key="answer" :value="breakdown.percentage" :color="color()" :class="{'text-dark': breakdown.percentage === 0, 'text-light': breakdown.percentage > 0}">
                    {{ answer }} ({{ breakdown.total }})
                </progress-bar>
            </template>
            <!--<dounut-chart :data="poll.statistics.breakdown" />-->
        </card-body>
        <card-footer>
            <div class="icon social fb">
                <font-awesome-icon :icon="['fab', 'facebook']" />
            </div>
            <div class="icon social tw">
                <font-awesome-icon :icon="['fab', 'twitter']" />
            </div>
            <div class="icon social em">
                <font-awesome-icon icon="envelope" />
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

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
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
        FontAwesomeIcon
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
