<template>
    <div class="poll-question" :style="{width: width && `${width}px`}" :class="{'ie': ie}">
        <div v-if="poll.image || poll.embed || poll.html || poll.url" class="mb-3">
            <img-loader v-if="poll.image" :src="poll.image.url" height="350px" class="poll-img" />
            <img-loader v-else-if="poll.embed" :src="poll.embed.url" height="350px" class="poll-img" />
        
            <div v-if="poll.html" class="poll-content" v-html="poll.html" />
 
            <!--
            @todo: need to make animate css compatible with purgecss by making
                   an alt syntax from `<animate-css name="fade" in>` to 
                   `<animate-css fadeIn>`, so that the regex can match the css
                   names.

            <animate-css name="fade" in>
                <poll-embed v-if="!poll.embed && poll.url" :key="poll.id" :poll="poll" :width="width" />
            </animate-css>
            -->

            <poll-embed v-if="!poll.embed && poll.url" :key="poll.id" :poll="poll" :width="width" />
        </div>

        <div v-if="poll.answers" class="poll-buttons">
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
                    size="lg"
                    type="button"
                    variant="primary"
                    outline
                    @click="onClickAnswer(key)">
                    <span v-html="key" />
                </btn>
            </btn-group>
        </div>

        <div v-if="poll.sponsor && poll.options.hide_sponsor !== '1'" class="text-center mt-4 d-flex justify-content-center align-items-center">
            <font-awesome-icon icon="star" class="mr-2 text-secondary" />
            <em>This poll is sponsored by <a v-if="poll.sponsor.url" :href="poll.sponsor.url">{{ poll.sponsor.name }}</a><template v-else>{{ poll.sponsor.name }}</template></em>
            <font-awesome-icon icon="star" class="ml-2 text-secondary" />
        </div>
        
        <poll-social-buttons :poll="poll" />
    </div>
</template>

<script>
// import AnimateCss from '@vue-interface/animate-css';
import Btn from '@vue-interface/btn';
import { BtnGroup } from '@vue-interface/btn-group';

import ImgLoader from '../ImgLoader';
import PollEmbed from './PollEmbed';

import ResponsiveBlocks from '../../Directives/ResponsiveBlocks';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';

library.add(faStar);

export default {

    name: 'PollQuestion',

    components: {
        Btn,
        BtnGroup,
        ImgLoader,
        PollEmbed,
        // AnimateCss,
        FontAwesomeIcon,
        PollSocialButtons: () => import(/* webpackChunkName: 'poll-social-buttons' */'./PollSocialButtons')
    },

    directives: {
        ResponsiveBlocks
    },

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
            vertical: false
        };
    },

    computed: {
        ie() {
            return !!window.document.documentMode;
        }
    },

    methods: {

        onClickAnswer(answer) {
            this.answer = answer;
            this.$emit('input', answer);
            this.$emit('update:value', answer);
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