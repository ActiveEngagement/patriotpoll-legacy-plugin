<template>
    <div class="poll">
        <div v-if="$slots['activity-indicator'] && loading">
            <slot name="activity-indicator" />
        </div>

        <div v-if="$slots['before-poll']" class="mb-3">
            <slot name="before-poll" />
        </div>

        <template v-if="poll">  
            <poll-header v-if="!loading" :poll="poll" />

            <div :style="styles" class="mx-auto">
                <slide-deck :active="active" @enter="slide => this.$emit('slide-enter', slide)">
                    <div key="question">
                        <poll-question
                            v-model="answer"
                            :poll="poll"
                            :width="width"
                            :value="answer"
                            @loaded="loading = false"
                            @convert="onConvert"
                            @submit-failed="onSubmitFailed">
                            <template #before-media>
                                <slot name="poll-question-before-media" />
                            </template>
                            <template #after-media>
                                <slot name="poll-question-after-media" />
                            </template>
                            <template #after-buttons>
                                <slot name="poll-question-after-buttons" />
                            </template>
                            <template #after-social-buttons>
                                <slot name="poll-question-after-social-buttons" />
                            </template>
                        </poll-question>
                    </div>

                    <div key="contact">
                        <poll-form
                            ref="form"
                            :answer="answer"
                            :poll="poll"
                            :api-key="apiKey"
                            :errors="errors"
                            @convert="onConvert"
                            @cancel="onClickBack"
                            @loaded="loading = false"
                            @automatic-submit="onAutomaticSubmit" />
                    </div>

                    <div key="results">
                        <poll-results
                            :poll="poll"
                            :api-key="apiKey"
                            :permalink="permalink"
                            :share-buttons="shareButtons"
                            @back="onClickBack"
                            @next="onClickNext">
                            <template #results-after-chart>
                                <slot name="results-after-chart" />
                            </template>
                            <template #results-after-social-buttons>
                                <slot name="results-after-social-buttons" />
                            </template>
                            <template #results-after-next-poll>
                                <slot name="results-after-next-poll" />
                            </template>
                        </poll-results>
                    </div>
                </slide-deck>
            </div>
        </template>
        <div v-if="$slots['after-poll']" class="mt-3">
            <slot name="after-poll" />
        </div>
    </div>
</template>

<script>
import Permalink from '../../Mixins/Permalink';
import { unit } from '@vue-interface/utils';
import { get } from '../../Helpers/URLSearchParams';

export default {

    components: {
        PollForm: () => import(/* webpackChunkName: 'poll-form', webpackPrefetch: true */ './PollForm'),
        PollHeader: () => import(/* webpackChunkName: 'poll-header', webpackPrefetch: true */ './PollHeader'),
        PollQuestion: () => import(/* webpackChunkName: 'poll-question', webpackPrefetch: true */ './PollQuestion'),
        PollResults: () => import(/* webpackChunkName: 'poll-results', webpackPrefetch: true */ './PollResults'),
        SlideDeck: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/slide-deck').then(({ SlideDeck }) => SlideDeck),
    },

    mixins: [
        Permalink
    ],

    props: {

        apiKey: String,

        showDate: {
            type: Boolean,
            default: false
        },

        maxWidth: {
            type: [Number, String],
            default: 520
        },

        poll: Object,

        shareButtons: {
            type: Boolean,
            default: true
        },

        scrollTo: HTMLElement,

        step: [Number, String],

        width: [Number, String]

    },

    data() {     
        return {
            answer: get('answer'),
            active: this.step || (get('answer') && 'contact'),
            errors: null,
            initialized: false,
            loading: true,
        };
    },

    computed: {

        styles() {
            return {
                display: this.loading ? 'none' : undefined,
                width: this.width && unit(this.width),
                maxWidth: this.maxWidth && unit(this.maxWidth)
            };
        }

    },

    watch: {

        answer(value) {
            this.active = value ? 'contact' : 'question';
        },

        active(value) {
            this.$emit('step', value);

            setTimeout(() => {
                this.$refs.form && this.$refs.form.focusOnEmpty();
            }, 333);
        },

        poll() {
            this.errors = null;
        },

        step(value) {
            this.active = value;
        }

    },

    methods: {

        onAutomaticSubmit({ submit, form }) {
            this.loading = true;

            submit(form).then(() => this.loading = false);
        },

        onConvert(poll) {
            this.$emit('convert', poll);
            this.active = 'results';
        },

        onClickBack() {
            this.answer = null;
            this.active = null;
        },

        onClickNext(poll) {
            console.log('next');
            this.answer = null;
            this.$emit('next', poll);
        },

        onSubmitFailed(errors) {
            this.errors = errors;
            this.active = 'contact';
        }

    }

};
</script>
