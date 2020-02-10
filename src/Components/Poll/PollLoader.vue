<template>
    <div class="poll-loader" :class="{'loading': loading}" :style="style">
        <activity-indicator v-if="loading" label="Loading..." type="spinner" center />
        <div v-else class="poll">
            <poll
                v-if="currentPoll"
                :api-key="apiKey"
                :poll="currentPoll"
                :step="currentStep"
                :scroll-to="scrollTo"
                @step="onStep"
                @next="onNext"
                @slide-enter="onSlideEnter" />
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import Poll from './Poll';
import VueRouter from 'vue-router';
import { unit } from 'vue-interface/src/Helpers/Functions';
import PatriotPollPlugin from '../../Plugins/PatriotPollPlugin';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

Vue.use(VueRouter);
Vue.use(PatriotPollPlugin);

export default {

    router: new VueRouter(),

    name: 'PollLoader',

    components: {
        Poll,
        ActivityIndicator
    },

    props: {

        apiKey: {
            type: String,
            required: true
        },

        id: [Number, String],

        maxWidth: [Number, String],

        path: {
            type: String,
            default: '/:id?/:step?'
        },

        poll: Object,
        
        scrollTo: HTMLElement,

        slug: [Number, String],

        step: [Number, String],

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

        style() {
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
            if(this.$route.params.step !== step) {
                this.$router.push({
                    name: 'poll', 
                    params: {
                        step,
                        id: this.key()
                    }
                });
            }
        },

        currentPoll(value) {
            this.loading = !value;
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
        this.initializeRoutes();

        if(this.$route.params.step) {
            this.$router.push({
                name: 'poll',
                params: {
                    id: this.key()
                }
            });
        }
    },

    mounted() {
        if(this.startingPoll) {
            // this.loading = false;
            // this.$emit('load', this.currentPoll = this.startingPoll);
            this.currentPoll = this.startingPoll;
        }
        else {
            this.load(this.key());
        }
    },
    
    methods: {
        
        key() {
            return this.$route && this.$route.params.id || this.id || this.slug;   
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

        load(id) {
            this.loading = true;
            
            return this.$axios.get(`polls/${id}`, {
                header: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            })
                .then(({ data }) => {
                    this.currentPoll = data;
                }, e => {
                    this.exception = e;
                });
        },

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

    }

};
</script>

<style lang="scss">
.poll {
    max-width: 520px;

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
