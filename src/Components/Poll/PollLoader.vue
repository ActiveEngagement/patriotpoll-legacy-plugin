<template>
    <div class="patriot-poll form-group">
        <activity-indicator v-if="loading" type="pulse" min-height="350" center />
        <poll
            v-else-if="currentPoll"
            :api-key="apiKey"
            :poll="currentPoll"
            :step="currentStep"
            :scroll-to="scrollTo"
            :width="width"
            :class="{'loading': loading}"
            :permalink="permalink"
            :hide-date="hideDate"
            :share-buttons="shareButtons"
            @step="onStep"
            @next="onNext"
            @slide-enter="onSlideEnter" />
            
        <div v-else class="poll-exception-wrapper">
            <div class="poll-exception">
                <h2 class="text-center">
                    Ooops!
                </h2>
                <h3 class="text-center font-weight-light mb-4">
                    There are no polls at this time.
                </h3>
                <animated-clock />
            </div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios';
import Permalink from '../../Mixins/Permalink';
import VueSocialSharing from 'vue-social-sharing';
import PatriotPollPlugin from '../../Plugins/PatriotPollPlugin';
 
import { ActivityIndicator, register } from '@vue-interface/activity-indicator';

import Dots from '@vue-interface/activity-indicator/src/types/Dots';
import Pulse from '@vue-interface/activity-indicator/src/types/Pulse';

import Poll from './Poll';

register({
    dots: Dots,
    pulse: Pulse
});

const BASE_URL = 'https://api.patriotpoll.net/v1';

export default {

    components: {
        ActivityIndicator,
        Poll,
        AnimatedClock: () => import(/* webpackChunkName: 'animated-clock', webpackPrefetch: true */ '../AnimatedClock'),
    },

    mixins: [
        Permalink   
    ],

    props: {

        apiKey: String,

        hideDate: {
            type: Boolean,
            default: false
        },

        baseUrl: String,

        center: {
            type: Boolean,
            default: true
        },

        id: [Number, String],

        maxWidth: [Number, String],

        poll: Object,

        shareButtons: {
            type: Boolean,
            default: true
        },
        
        scrollTo: HTMLElement,

        slug: [Number, String],

        step: [Number, String],

        width: [Number, String]

    },

    data() {
        return {
            routed: false,
            exception: null,
            currentPoll: null,
            loading: !this.poll,
            currentStep: this.step,
            startingPoll: this.poll,
        };
    },

    watch: {

        ['$route.params.step'](value) {
            this.currentStep = value;
        },
        
        ['$route.params.id'](value) {
            this.load(value);
        },

        step(value) {
            this.currentStep = value;
        },

        exception(e) {
            this.loading = false;
        },

        currentPoll(value) {
            this.loading = !value;
            this.$emit('load', value);
        },

        loading(value) {
            this.$emit('toggle-loading', value);
            this.$emit(value ? 'start-loading' : 'stop-loading');
        },

        poll(value) {
            this.currentPoll = value;
        }

    },

    created() {
        this.$root.constructor.use(VueSocialSharing);
        this.$root.constructor.use(PatriotPollPlugin, {
            apiKey: this.apiKey,
            baseUrl: this.baseUrl
        });
    },

    mounted() {
        const key = this.key();

        if(this.startingPoll) {
            // this.loading = false;
            // this.$emit('load', this.currentPoll = this.startingPoll);
            this.currentPoll = this.startingPoll;
        }
        else if(this.key()) {
            this.load(this.key());
        }
        else {
            this.load();
        }
    },
    
    methods: {
        
        key() {
            return this.id || this.slug;   
        },

        onNext(poll) {
            this.$emit('next', poll);
        },

        onSlideEnter(slide) {
            this.$emit('slide-enter', slide);
        },

        onStep(step) {
            this.$emit('step', this.currentStep = step);
        },

        search() {
            return this.$patriotpoll.get('polls')
                .then(({ data }) => {
                    return data;
                }, e => {
                    this.exception = e;

                    return e;
                });
        },

        load(id) {
            this.loading = true;

            if(!id) {
                return this.search()
                    .then(({ data }) => {
                        if(data && data.length) {
                            return this.currentPoll = data[0];
                        }
                    }, e => {
                        this.exception = e;
                    });
            }
            
            return this.$patriotpoll.get(`polls/${id}`)
                .then(({ data }) => {
                    return this.currentPoll = data;
                }, e => {
                    this.exception = e;

                    return e;
                });
        }

    }

};
</script>

<style lang="scss">
.patriot-poll {
    @import '~@fortawesome/fontawesome-svg-core/styles';
    @import '~@vue-interface/form-control/src/scss/CustomFields.scss';
    @import '../../assets/scss/mixins';
    @import '../../assets/scss/variables';
    @import '~bootstrap/scss/_variables';
    @import '~bootstrap/scss/_functions';
    @import '~bootstrap/scss/_mixins';

    margin: 0; // 1
    font-family: $font-family-base;
    // @include font-size($font-size-base);
    font-weight: $font-weight-base;
    line-height: $line-height-base;
    color: $body-color;
    text-align: left; // 3
    background-color: $body-bg; // 2

    .btn {
        height: auto;
    }

    .poll-exception-wrapper {
        display: flex;
        max-width: 100vw;
        max-height: 100vh;

        .poll-exception {
            margin: auto;
        }
    }

    .poll {
        margin: 0; // 1
        font-family: $font-family-base;
        @include font-size($font-size-base);
        font-weight: $font-weight-base;
        line-height: $line-height-base;
        color: $body-color;
        text-align: left; // 3
        background-color: $body-bg; // 2

        &:not(.loading) {
            position: relative;
            margin: 0 auto;
        }

        .fade-enter-active, .fade-leave-active {
            transition: opacity .75s;
        }
        .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
            opacity: 0;
        }
    }
}
</style>
