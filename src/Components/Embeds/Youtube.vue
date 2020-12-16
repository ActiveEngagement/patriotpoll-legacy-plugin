<template>
    <div class="w-100">
        <a v-if="error && image" :href="poll.url">
            <img
                :src="image"
                :width="calculatedWidth"
                :height="calculatedHeight">
        </a>

        <iframe
            v-else
            ref="iframe"
            :src="`${src}`"
            :width="calculatedWidth"
            :height="calculatedHeight"
            type="text/html"
            frameborder="0" />
    </div>
</template>

<script>
import { script } from '@vue-interface/utils';
import Embed from './Embed';

export default {

    name: 'Youtube',

    mixins: [
        Embed
    ],

    props: {

        autoplay: {
            type: Boolean,
            default: false
        },

        controls: {
            type: Boolean,
            default: true
        },

        end: Number,

        start: Number,

    },

    data() {
        return {
            api: null,
            error: false,
            player: null,
        };
    },

    computed: {

        src() {
            return `https://www.youtube.com/embed/${this.id}?enablejsapi=1`;
        }

    },

    mounted() {
        window.addEventListener('resize', this.resize());

        this.ready().then(YT => {
            const player = new YT.Player(this.$refs.iframe, {
                events: {
                    onReady: () => {
                        if(!player.getDuration()) {
                            this.error = new Error('Video could not be loaded');
                        }
                    }
                }
            });
        });
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },

    methods: {

        async ready() {
            await script(`https://www.youtube.com/iframe_api`);
                        
            return new Promise(resolve => {
                window.YT.ready(() => {
                    this.$nextTick(() => resolve(window.YT));
                });
            });
        },

        resize() {
            this.calculatedWidth = this.width || this.$el.clientWidth;
            this.calculatedHeight = this.height || this.calculatedWidth * (9 / 16);

            return this.resize;
        },

        onLoad(e) {
            this.$emit('loaded', e);
        }

    }

};
</script>
