<template>
    <activity-indicator
        v-if="activity"
        type="pulse"
        size="sm"
        min-height="200px"
        center />
        
    <div v-else-if="nextPoll" class="mt-5 mb-3 mx-3">
        <h4 class="mb-2">
            Next Up...
        </h4>
        <h3 class="mb-4 font-weight-light">
            {{ nextPoll.question }}
        </h3>
        <btn
            v-permalink.native="nextPoll"
            type="button"
            size="lg"
            variant="success"
            class="d-inline-flex justify-content-center align-items-center"
            block>
            <font-awesome-icon icon="poll" size="2x" class="mr-3" /> Take Next Poll
            <font-awesome-icon icon="long-arrow-alt-right" size="2x" class="ml-3" />
        </btn>
    </div>
</template>

<script>
import Btn from '@vue-interface/btn';
import Permalink from '../../Mixins/Permalink';
import { ActivityIndicator } from '@vue-interface/activity-indicator';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLongArrowAltRight, faPoll } from '@fortawesome/free-solid-svg-icons';

library.add(faLongArrowAltRight, faPoll);

export default {
    components: {
        ActivityIndicator,
        Btn,
        FontAwesomeIcon,
    },
    mixins: [
        Permalink   
    ],
    props: {
        poll: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            activity: true,
            nextPoll: null
        };
    },
    mounted() {
        this.$patriotpoll.get(`/unanswered`)
            .then(({ data }) => {
                this.nextPoll = data;
                this.activity = false; 
            }, e => {
                this.activity = false;
            });
    }
};
</script>