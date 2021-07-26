<template>
    <div class="poll-question mx-3" :style="{width: width && `${width}px`}" :class="{'ie': ie}">
        <div v-if="poll.image || poll.embed || poll.html || poll.url" class="mb-3">
            <img-loader v-if="poll.image" :src="poll.image.url" height="350px" class="poll-img" />
        
            <div v-if="poll.html" class="poll-content" v-html="poll.html" />

            <poll-embed v-if="poll.embed || poll.url" :key="poll.id" :poll="poll" :width="width" />

            <slot name="after-media" />
        </div>

        <div v-if="poll.answers" class="poll-buttons px-3 px-md-0">
            <btn-group
                v-responsive-blocks="!ie && {selector: 'span'}"
                :vertical="vertical"
                :style="!ie && {'display': !vertical ? 'grid' : 'inherit', 'grid-template-columns': `repeat(${poll.answers.length}, minmax(${100 / poll.answers.length}%, 1fr)`}"
                class="mx-auto w-100"
                toggle
                @resize.native="onResize">
                <btn
                    v-for="key in poll.answers"
                    :key="key"
                    :active="key === value"
                    :disabled="disabled"
                    size="lg"
                    type="button"
                    variant="primary"
                    outline
                    @click="onClickAnswer(key)">
                    <span v-html="key" />
                </btn>
            </btn-group>

            <div v-if="$slots['after-buttons']" class="mt-3">
                <slot name="after-buttons" />
            </div>
        </div>

        <div v-if="poll.sponsor && poll.options.hide_sponsor !== '1'" class="text-center mt-4 d-block d-flex justify-content-center align-items-center">
            <font-awesome-icon icon="star" class="mr-2 text-secondary" />
            <em>This poll is sponsored by <a v-if="poll.sponsor.url" :href="poll.sponsor.url" target="_blank" class="d-flex-inline">{{ poll.sponsor.name }} <small><font-awesome-icon :icon="['fas', 'external-link-alt']" /></small></a><template v-else>{{ poll.sponsor.name }}</template></em>
            <font-awesome-icon icon="star" class="ml-2 text-secondary" />
        </div>
        
        <a
            v-if="poll.sponsor && poll.sponsor.logo"
            :href="poll.sponsor.url"
            class="mt-4 d-block text-center d-flex justify-content-center align-items-center"
            target="_blank">
            <img v-if="poll.sponsor.logo" :src="poll.sponsor.logo.url" style="max-width: 300px; max-height: 100px;">
        </a>
        
        <poll-social-buttons :poll="poll">
            <slot name="after-social-buttons" />
        </poll-social-buttons>
    </div>
</template>

<script>
import CanSubmit from '../../Mixins/CanSubmit';
import ImgLoader from '../ImgLoader';
import PollEmbed from './PollEmbed';
import ResponsiveBlocks from '../../Directives/ResponsiveBlocks';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faExternalLinkAlt, faStar } from '@fortawesome/free-solid-svg-icons';

library.add(faStar, faExternalLinkAlt);

export default {

    components: {
        Btn: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/btn'),
        BtnGroup: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/btn-group').then(({ BtnGroup }) => BtnGroup),
        ImgLoader,
        PollEmbed,
        // AnimateCss,
        FontAwesomeIcon: () => import(/* webpackChunkName: 'font-awesome', webpackPrefetch: true */'@fortawesome/vue-fontawesome').then(({ FontAwesomeIcon }) => FontAwesomeIcon),
        PollSocialButtons: () => import(/* webpackChunkName: 'poll-social-buttons', webpackPrefetch: true */'./PollSocialButtons')
    },

    directives: {
        ResponsiveBlocks
    },

    mixins: [
        CanSubmit
    ],

    props: {

        value: [String, Number],

        poll: {
            type: Object,
            required: true
        },

        width: Number

    },

    data() {
        return {
            answer: null,
            disabled: false,
            vertical: false
        };
    },

    computed: {
        ie() {
            return !!window.document.documentMode;
        }
    },
    
    beforeMount() {
        this.$emit('loaded');
    },

    methods: {

        shouldSubmitOnAnswer() {
            return !!this.contact && !!this.lastSubmit && !this.isDisabled();
        },

        onClickAnswer(answer) {
            if(this.shouldSubmitOnAnswer()) {
                this.disabled = true;
                this.submit({
                    answer
                }).catch(e => {
                    this.disabled = false;
                });
            }
            else {
                this.answer = answer;
                this.$emit('input', this.answer);
                this.$emit('update:value', this.answer);
            }
        },

        onResize(event) {
            this.vertical = (
                event.doesTextOverflow ||
                event.doesHaveLineBreaks ||
                event.doesCalculatedWidthExceedContainer
            );
        }

    }

};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';
@import '../../assets/scss/variables';

.poll-question {
    @include body-font;

    .poll-content {
        font-size: 18px;
    }
    
    &:not(.ie) .poll-buttons .btn-group {
        display: flex;
    }
    
    &.ie .poll-buttons .btn-group {
        display: block;

        .btn {
            display: block;
            width: 100%;
            margin: 0;
            border-radius: 0;
        }

        .btn:first-child {
            border-radius: .25rem .25rem 0 0 !important;
        }

        .btn:last-child {
            border-radius: 0 0 .25rem .25rem !important;
        }

        .btn:not(:last-child) {
            border-bottom: 0;
        }
    }
}
</style>