<template>
    <card class="poll-card">
        <card-header>{{ poll.published_at | date('MMMM D, YYYY') }}</card-header>
        <card-body>
            <a :href="path || poll.permalink">
                <card-title v-if="poll.question || poll.title" v-html="poll.question || poll.title" />
                <div v-else-if="poll.html" v-html="poll.html" />
                <div v-if="poll.image" :style="{'background': `url(${poll.image.url}) center / cover no-repeat`, height: '12rem'}" />
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
import DateFilter from 'vue-interface/src/Filters/Date/DateFilter';
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

        path: String,

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

<style lang="scss">
@import '../../assets/scss/mixins';
@import '../../assets/scss/variables';
@import 'node_modules/bootstrap/scss/functions';
@import 'node_modules/bootstrap/scss/variables';

.poll-card {
    // margin: 15px;
    // padding: 15px;
    
    .card-header, .card-footer {
        border: none;
        background-color: white;
    }

    .card-header {
        @include body-font;
        background-color: transparent;
        padding: none;
        padding-bottom: 0px;
        color: $primary-red;
        font-size: 12px;
        text-transform: uppercase;
        text-align: right;
        font-weight: 700;
        letter-spacing: 1px;
    }

    .card-title {
        @include body-font;
    }

    .card-footer {
        margin: 0px auto;
        text-align: center;
        padding: 0px 2px 5px 10px;
    }

    .poll-img {
        margin-bottom: 15px;
    }

	.icon {
		i {
			font-size: 20px;
			left: 9px;
			top: 10px;
			color: $primary-blue;
		}

		&.social {
			float: right;
			margin: 0 5px 8px 0;
			cursor: pointer;
			color: $primary-blue;
			transition: 0.25s;
			-moz-transition: 0.25s;
			-webkit-transition: 0.25s;
			-o-transition: 0.25s;
			margin-right: 15px;
		}
    }

    .progress {
        margin-bottom: 10px;
        height: 2.5rem;
        border-radius: 0;
        overflow: scroll;
        background-color: #f6f6f6;

        span {
            padding-left: .5rem;
        }

        &.text-dark span {
            color: $dark;
        }

        .progress-bar {
            text-align: left;
            background-color: $primary-red;
            color: white;
            font-size: 1rem;
            font-weight: 500;
        }
    }
}
</style>
