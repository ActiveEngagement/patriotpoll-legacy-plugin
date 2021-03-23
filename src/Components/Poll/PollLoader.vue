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
            @convert="(...args) => this.$emit('convert', ...args)"
            @next="(...args) => this.$emit('next', ...args)"
            @slide-enter="(...args) => this.$emit('slide-enter', ...args)"
            @step="step => this.$emit('step', currentStep = step)" />
            
        <div v-else class="poll-exception-wrapper">
            <div class="poll-exception">
                <h2 class="text-center">
                    Ooops!
                </h2>
                <h3 class="text-center font-weight-light mb-4">
                    There are no polls at this time.
                </h3>
            </div>
        </div>
    </div>
</template>

<script>
import Permalink from '../../Mixins/Permalink';
import VueSocialSharing from 'vue-social-sharing';
import PromotionDispatcher from '../../Helpers/PromotionDispatcher';
import PatriotPollPlugin from '../../Plugins/PatriotPollPlugin';
import { ActivityIndicator, register, Dots, Pulse } from '@vue-interface/activity-indicator';

import Poll from './Poll';

register({
    dots: Dots,
    pulse: Pulse
});

const BASE_URL = 'https://api.patriotpoll.net/v1';

export default {

    components: {
        ActivityIndicator,
        Poll
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
            dispatcher: null,
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
        const params = new URLSearchParams(window.location.search);

        this.dispatcher = new PromotionDispatcher(this, params.get('source'));
    
        this.$root.constructor.use(VueSocialSharing);
        this.$root.constructor.use(PatriotPollPlugin, {
            apiKey: this.apiKey,
            baseUrl: this.baseUrl
        });
    },

    mounted() {
        const key = this.key();

        if(this.startingPoll) {
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

        onSlideEnter(slide) {
            this.$emit('slide-enter', slide);
        },

        search(params) {
            this.loading = true;
            
            return this.$patriotpoll.get('polls', {
                params
            })
                .then(({ data }) => {
                    return data;
                });
        },

        first() {
            return this.search({
                unanswered: 1
            })
                .then(({ data }) => {
                    if(data && data[0]) {
                        return data[0];
                    }

                    throw new Error('No polls at this time!');
                });
        },

        find(id) {
            this.loading = true;

            return this.$patriotpoll.get(`polls/${id}`)
                .then(({ data }) => {
                    return data;
                });
        },

        load(id) { 
            return (id ? this.find(id) : this.first())
                .then(data => {
                    this.currentPoll = data;
                }, e => {
                    this.exception = e;
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

    
    h1 {
        font-size: 1.75rem;
        line-height: 1.75rem;
        padding-top: .5rem;
    }

    @media(min-width:768px) {
        h1 {
            font-size: 2.5rem;
            line-height: 2.5rem;
            padding-top: 0;
        }
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

        iframe {
            max-width: 100%;
        }
    }
}
</style>
