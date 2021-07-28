<template>
    <div class="patriot-poll form-group">
        <poll
            :api-key="apiKey"
            :loading="loading"
            :poll="currentPoll"
            :step="currentStep"
            :scroll-to="scrollTo"
            :width="width"
            :permalink="permalink"
            :hide-date="hideDate"
            :share-buttons="shareButtons"
            @convert="(...args) => this.$emit('convert', ...args)"
            @next="(...args) => this.$emit('next', ...args)"
            @slide-enter="(...args) => this.$emit('slide-enter', ...args)"
            @step="step => this.$emit('step', currentStep = step)">
            <template #activity-indicator>
                <activity-indicator type="pulse" min-height="350" center />
            </template>
            <template #no-results>
                <div class="poll-exception-wrapper">
                    <div class="poll-exception">
                        <h2 class="text-center">
                            Ooops!
                        </h2>
                        <h3 class="text-center font-weight-light mb-4">
                            There are no polls at this time.
                        </h3>
                    </div>
                </div>
            </template>
            <template #before-poll>
                <slot name="before-poll" />
            </template>
            <template #after-poll>
                <slot name="after-poll" />
            </template>
            <template #poll-question-before-media>
                <slot name="poll-question-before-media" />
            </template>
            <template #poll-question-after-media>
                <slot name="poll-question-after-media" />
            </template>
            <template #poll-question-after-buttons>
                <slot name="poll-question-after-buttons" />
            </template>
            <template #poll-question-after-social-buttons>
                <slot name="poll-question-after-social-buttons" />
            </template>
            <template #results-after-chart>
                <slot name="results-after-chart" />
            </template>
            <template #results-after-social-buttons>
                <slot name="results-after-social-buttons" />
            </template>
            <template #results-after-next-poll>
                <slot name="results-after-next-poll" />
            </template>
        </poll>
    </div>
</template>

<script>
import VueSocialSharing from 'vue-social-sharing';

import Permalink from '../../Mixins/Permalink';
import PromotionDispatcher from '../../Helpers/PromotionDispatcher';
import { source } from '../../Helpers/URLSearchParams';
import PatriotPollPlugin from '../../Plugins/PatriotPollPlugin';
import { register } from '@vue-interface/activity-indicator';

register({
    pulse: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/activity-indicator').then(({ Pulse }) => Pulse)
});

export default {
    components: {
        ActivityIndicator: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/activity-indicator').then(({ ActivityIndicator }) => ActivityIndicator),
        Poll: () => import(/* webpackChunkName: 'poll', webpackPrefetch: true */'./Poll')
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
            automaticallySubmitting: false,
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
            this.currentPoll = null;
            this.load(value);
        },

        step(value) {
            this.currentStep = value;
        },

        exception(e) {
            this.loading = false;
            this.$emit('error', e);
        },

        currentPoll(value) {
            this.loading = !value;

            if(value) {
                this.$nextTick(() => this.$emit('load',  value));
            }
        },

        loading(value) {
            this.$emit('toggle-loading', value);

            if(value) {
                this.$emit('start-loading');
            }
            else {
                this.$emit('stop-loading');
            }
        },

        poll(value) {
            this.currentPoll = value;
        }

    },

    beforeCreate() {
        this.$root.constructor.use(VueSocialSharing);
        this.$root.constructor.use(PatriotPollPlugin, {
            apiKey: this.$options.propsData.apiKey,
            baseUrl: this.$options.propsData.baseUrl
        });
    },

    created() {
        this.dispatcher = new PromotionDispatcher(
            this, source()
        );
    },

    async mounted() {
        await this.$patriotpoll.mounted(this);

        if(this.startingPoll) {
            this.currentPoll = this.startingPoll;
        }
        else {
            await this.load(this.key());
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
            
            return this.$patriotpoll.get('unanswered', { params }).then(({ data }) => data);
        },

        contact(id) {
            return this.$patriotpoll.get(`contacts/${id}`).then(({ data }) => data);
        },

        first() {
            return this.search().catch(() => {
                throw new Error('No polls at this time!');
            });
        },

        find(id) {
            this.loading = true;

            return this.$patriotpoll.get(`polls/${id}`).then(({ data }) => data);
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
