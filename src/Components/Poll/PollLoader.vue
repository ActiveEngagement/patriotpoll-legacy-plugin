<template>
    <div class="patriot-poll">
        <activity-indicator v-if="loading" label="Loading..." type="spinner" center />
        <poll
            v-else-if="currentPoll"
            :api-key="apiKey"
            :poll="currentPoll"
            :step="currentStep"
            :scroll-to="scrollTo"
            :width="width"
            :class="{'loading': loading, 'mx-auto': center}"
            :style="styles"
            @step="onStep"
            @next="onNext"
            @slide-enter="onSlideEnter" />
    </div>
</template>

<script>
// import Vue from 'vue';
import Poll from './Poll';
// import VueRouter from 'vue-router';
import PatriotPoll from '../../Mixins/PatriotPoll';
import unit from 'vue-interface/src/Helpers/Functions/unit';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

// Vue.use(VueRouter);
// Vue.use(PatriotPoll);

export default {

    // router: new VueRouter(),

    components: {
        Poll,
        ActivityIndicator
    },

    mixins: [
        PatriotPoll
    ],

    props: {

        center: {
            type: Boolean,
            default: true
        },

        id: [Number, String],

        maxWidth: {
            type: [Number, String],
            default: 520
        },

        path: {
            type: String,
            default: '/:id?/:step?'
        },

        poll: Object,
        
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

    computed: {

        styles() {
            return {
                maxWidth: this.maxWidth ? unit(this.maxWidth) : null
            };
        }

    },

    watch: {

        ['$route.params.step'](value) {
            this.currentStep = value;
        },
        
        ['$route.params.id'](value) {
            this.load(value);
        },

        currentStep(step) {
            /*
            if(this.$route.params.step !== step) {
                this.$router.push({
                    name: 'poll', 
                    params: {
                        step,
                        id: this.key()
                    }
                });
            }
            */
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
        this.constructor.use(PatriotPoll);

        /*
        this.initializeRoutes();

        if(this.$route.params.step) {
            this.$router.push({
                name: 'poll',
                params: {
                    id: this.key()
                }
            });
        }
        */
    },

    mounted() {
        const key = this.key();

        if(this.startingPoll) {
            // this.loading = false;
            // this.$emit('load', this.currentPoll = this.startingPoll);
            this.currentPoll = this.startingPoll;
        }
        else if(key) {
            this.load(this.key());
        }
        else {
            this.search().then(({ data }) => {
                this.currentPoll = data[0];
            });
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
            
            return this.$patriotpoll.get(`polls/${id}`)
                .then(({ data }) => {
                    return this.currentPoll = data;
                }, e => {
                    this.exception = e;

                    return e;
                });
        },

        /*
        initializeRoutes() {
            if(!this.routed) {
                this.$router.addRoutes([{
                    alias: '/',
                    name: 'poll',
                    path: this.path
                }]);

                this.routed = true;
            }
        }
        */

    }

};
</script>


<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/@fortawesome/fontawesome-svg-core/styles';

.patriot-poll {
    margin: 0; // 1
    font-family: $font-family-base;
    @include font-size($font-size-base);
    font-weight: $font-weight-base;
    line-height: $line-height-base;
    color: $body-color;
    text-align: left; // 3
    background-color: $body-bg; // 2
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
</style>
