<template>
    <div class="poll-results mt-4 p-3">
        <dounut-chart :data="poll.statistics.breakdown" :height="300" />

        <div class="mt-3">
            <div v-if="poll.next_poll" class="mt-5 mb-3">
                <transition name="fade" mode="out-in">
                    <card>
                        <card-body class="py-4">
                            <h4 class="mb-3">
                                Next Up...
                            </h4>
                            <h3 v-if="poll.next_poll.question" class="mb-0 font-weight-light" v-html="poll.next_poll.question" />
                            <div class="mt-4">
                                <btn type="button"
                                    size="lg"
                                    variant="success"
                                    class="d-inline-flex justify-content-center align-items-center"
                                    block
                                    @click="$emit('next', poll.next_poll)">
                                    <icon icon="poll" size="2x" class="mr-3" /> Take Next Poll <icon icon="long-arrow-alt-right" class="ml-3" size="2x" />
                                </btn>
                            </div>
                        </card-body>
                    </card>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import Btn from 'vue-interface/src/Components/Btn';
import Card from 'vue-interface/src/Components/Card';
import DounutChart from '../../Components/Charts/DounutChart';
import CardBody from 'vue-interface/src/Components/Card/CardBody';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons/faLongArrowAltLeft';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons/faLongArrowAltRight';

library.add(faLongArrowAltLeft);
library.add(faLongArrowAltRight);

export default {

    name: 'PollResults',

    components: {
        Btn,
        Card,
        CardBody,
        DounutChart
    },

    props: {

        apiKey: String,

        poll: {
            type: Object,
            required: true
        }

    }

};
</script>