<template>
    <div class="poll-question" :style="{width: width && `${width}px`}">
        <div v-if="poll.image || poll.embed || poll.html || poll.url" class="mb-3">
            <img-loader v-if="poll.image" :src="poll.image.url" height="350px" class="poll-img" />
            <img-loader v-else-if="poll.embed" :src="poll.embed.url" height="350px" class="poll-img" />
        
            <div v-if="poll.html" class="poll-content" v-html="poll.html" />
 
            <animate-css name="fade" in>
                <poll-embed v-if="!poll.embed && poll.url" :key="poll.id" :poll="poll" :width="width" />
            </animate-css>
        </div>

        <div v-if="poll.answers" class="d-flex">
            <btn-group
                v-responsive-blocks="{selector: 'span'}"
                :vertical="vertical"
                :style="{'display': !vertical ? 'grid' : 'inherit', 'grid-template-columns': `repeat(${poll.answers.length}, minmax(${100 / poll.answers.length}%, 1fr)`}"
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
    </div>
</template>

<script>
import ImgLoader from '../ImgLoader';
import PollEmbed from './PollEmbed';
import Btn from 'vue-interface/src/Components/Btn';
import BtnGroup from 'vue-interface/src/Components/BtnGroup';
import AnimateCss from 'vue-interface/src/Components/AnimateCss';
import ResponsiveBlocks from '../../Directives/ResponsiveBlocks';

export default {

    name: 'PollQuestion',

    components: {
        Btn,
        BtnGroup,
        ImgLoader,
        PollEmbed,
        AnimateCss
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

    watch: {

        answer(value) {
            this.$emit('input', value);
        }

    },

    methods: {

        onClickAnswer(answer) {
            this.answer = answer;
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
}
</style>