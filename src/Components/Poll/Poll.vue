<template>
    <div class="poll" :class="{'loading': loading}" :style="style">
        <activity-indicator v-if="loading" label="Loading..." type="spinner" center />
        <div v-else>
            <poll-form
                v-if="currentPoll"
                :step="step"
                :api-key="apiKey"
                :poll="currentPoll"
                :scroll-to="scrollTo"
                :request="httpRequestOptions"
                @step="onStep"
                @next="onNext"
                @slide-enter="onSlideEnter" />
        </div>
    </div>
</template>

<script>
import PollForm from './PollForm';
import Poll from '../../Models/Poll';
import { unit } from 'vue-interface/src/Helpers/Functions';
import HttpRequestOptions from '../../Mixins/HttpRequestOptions';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

export default {

    name: 'Poll',

    components: {
        PollForm,
        ActivityIndicator
    },

    mixins: [
        HttpRequestOptions
    ],

    props: {

        id: [Number, String],

        slug: [Number, String],

        step: [Number, String],

        poll: Object,

        model: Object,
        
        scrollTo: {
            type: [HTMLElement]
        },

        apiKey: {
            type: String,
            required: true
        },

        maxWidth: [Number, String]

    },

    data() {
        let poll = this.poll;

        if(this.model) {
            poll = this.model instanceof Poll ? this.model.toJSON() : this.model;
        }
        
        return {
            loading: !poll,
            currentPoll: null,
            startingPoll: poll
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

        '$route.params.id': function(value) {
            this.load(value);
        },

        loading(value) {
            this.$emit('toggle-loading', value);
            this.$emit(value ? 'start-loading' : 'stop-loading');
        },

        poll(value) {
            this.currentPoll = value;
        }

    },

    mounted() {
        if(this.startingPoll) {
            this.loading = false;
            this.$emit('load', this.currentPoll = this.startingPoll);
        }
        else if(!this.currentPoll) {
            this.load(this.id || this.slug).then(model => {
                this.$emit('load', model);
            }, err => {
                this.$emit('error', err);
            });
        }
    },
    
    methods: {

        onNext(poll) {
            this.$emit('next', poll);

            /*
            this.$router.push({name: 'poll', params: {
                id: poll.id,
                poll: poll
            }});
            */
        },

        onSlideEnter(slide) {
            this.$emit('slide-enter', slide);
        },

        onStep(poll) {
            this.$emit('step', poll);
        },

        load(id) {
            this.loading = true;

            if(id) {
                return Poll.find(id, this.httpRequestOptions)
                    .then(model => {
                        this.loading = false;

                        return this.currentPoll = model.toJSON();
                    });
            }
            else {
                return Poll.search(null, this.httpRequestOptions)
                    .then(response => {
                        this.loading = false; 

                        if(response.data.data.length) {
                            return this.currentPoll = response.data.data[0];
                        }
                    });
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
