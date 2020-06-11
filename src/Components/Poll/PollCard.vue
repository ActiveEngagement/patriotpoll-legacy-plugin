<template>
    <card class="poll-card">
        <card-header v-if="!hideDate">
            {{ poll.published_at | date('MMMM D, YYYY') }}
        </card-header>
        <card-body>
            <a v-permalink="poll">
                <card-title v-if="!hideQuestion && poll.question" v-html="poll.question" />
                <div v-if="!hideContent && poll.html" v-html="poll.html" />
                <div v-if="!hideImage && poll.image" :style="{'background': `url(${poll.image.url}) center / cover no-repeat`, height: '12rem'}" class="mb-3" />
                <div v-else-if="!hideImage && poll.embed" :style="{'background': `url(${poll.embed.url}) center / cover no-repeat`, height: '12rem'}" class="mb-3" />
            </a>
            <div v-if="!hideStatistics && poll.statistics" class="mt-2">
                <progress-bar v-for="(breakdown, answer) in poll.statistics.breakdown"
                    :key="answer"
                    :value="breakdown.percentage || 100"
                    :color="breakdown.percentage ? color() : 'transparent'"
                    class="mb-1 text-dark">
                    {{ answer }} ({{ Math.round(breakdown.percentage) }}%)
                </progress-bar>
            </div>
        </card-body>
    </card>
</template>

<script>
import randomcolor from 'randomcolor';
import Permalink from '../../Mixins/Permalink';
import Card from 'vue-interface/src/Components/Card';
import DateFilter from 'vue-interface/src/Filters/Date/DateFilter';
import CardBody from 'vue-interface/src/Components/Card/CardBody';
import ProgressBar from 'vue-interface/src/Components/ProgressBar';
import CardTitle from 'vue-interface/src/Components/Card/CardTitle';
import CardHeader from 'vue-interface/src/Components/Card/CardHeader';
import CardFooter from 'vue-interface/src/Components/Card/CardFooter';

/*
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

library.add(faTwitter);
library.add(faFacebook);
library.add(faEnvelope);
*/

export default {

    name: 'PollCard',

    components: {
        Card,
        CardBody,
        CardTitle,
        CardHeader,
        //CardFooter,
        ProgressBar,
        //DounutChart
        //FontAwesomeIcon
    },

    filters: {
        'date': DateFilter
    },

    mixins: [
        Permalink
    ],

    props: {

        poll: {
            type: Object,
            required: true
        },

        hideContent: {
            type: Boolean,
            default: false
        },

        hideImage: {
            type: Boolean,
            default: false
        },

        hideStatistics: {
            type: Boolean,
            default: false
        },

        hideQuestion: {
            type: Boolean,
            default: false
        },

        hideDate: {
            type: Boolean,
            default: false
        }

    },

    methods: {
        color(options) {
            return randomcolor(Object.assign({
                count: 1,
                luminosity: 'light'
            }, options))[0];
        }
    }

};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';
@import '../../assets/scss/variables';

.poll-card {
    border: 0;
    
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
        height: 2.25rem;
        border-radius: 0;
        overflow: scroll;
        background-color: #f6f6f6;

        span {
            font-size: .85em;
            padding-left: .5rem;
            line-height: 1em;
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
            overflow: visible;
        }
    }
}
</style>
