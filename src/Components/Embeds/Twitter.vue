<template>
    <div class="twitter-embed w-100" :style="{maxWidth: `${calculatedWidth}px`}">
        <div v-if="(activity || !loaded) && !image" class="position-relative" :style="{'min-height': '300px'}">
            <activity-indicator size="sm" type="pulse" :min-height="300" center />
        </div>

        <blockquote v-if="!activity || image" v-bind="attributes" :style="{'visibility': !loaded ? 'hidden' : 'visible'}">
            <a :href="url">
                <img v-if="image" :src="image.url || image" :alt="`Screenshot of ${image}.`" class="img-fluid">
            </a>
        </blockquote>
    </div>
</template>

<script>
import { script } from '@vue-interface/utils';
import { ActivityIndicator } from '@vue-interface/activity-indicator';

export default {

    name: 'Twitter',

    components: {
        ActivityIndicator
    },

    inheritAttrs: false,

    props: {

        align: {
            type: String,
            default: 'left',
            validate(value) {
                return ['left', 'right', 'center'].indexOf(value) !== -1;
            }
        },

        cards: {
            type: Boolean,
            default: true
        },

        conversation: {
            type: Boolean,
            default: true
        },

        dnt: {
            type: Boolean,
            default: true
        },

        image: [Object, String],

        handle: String,

        id: {
            type: String,
            required: true
        },

        lang: {
            type: String,
            default: 'en'
        },

        linkColor: String,

        theme: {
            type: String,
            default: 'light',
            validate(value) {
                return ['light', 'dark'].indexOf(value) !== -1;
            }
        },

        width: {
            type: Number,
            default: 520
        }

    },

    data() {
        return {
            twttr: null,
            loaded: false,
            activity: false,
            calculatedWidth: this.width
        };
    },

    computed: {

        url() {
            return `https://twitter.com/${this.handle}/status/${this.id}`;
        },

        attributes() {
            return {
                'class': 'twitter-tweet',
                'data-id': this.id,
                'data-cards': !this.cards ? 'hidden' : null,
                'data-conversation': !this.cards ? 'none' : null,
                'data-theme': this.theme,
                'data-link-color': this.linkColor,
                'data-width': this.width,
                'data-align': this.theme,
                'data-lang': this.lang,
                'data-dnt': this.dnt
            };
        }

    },

    watch: {
        loaded(value) {
            if(value) {
                this.$emit('loaded');
            }
        }
    },

    mounted() {
        script('https://platform.twitter.com/widgets.js').then(() => {
            window.twttr.ready(twttr => {
                this.twttr = twttr;
                this.activity = false;

                twttr.events.bind('loaded', (event) => {
                    this.loaded = true;

                    event.widgets.forEach(widget => {
                        widget.style.marginTop = 0;
                        widget.style.marginBottom = 0;
                    });
                });

                window.addEventListener('resize', this.resize());
            });
        });
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },

    methods: {

        resize() {
            if(!this.width) {
                this.calculatedWidth = Math.min(this.$el.clientWidth, 550);
            }

            return this.resize;
        }

    }

};
</script>

<style lang="scss">
.twitter-embed > div {
    margin-left: auto;
    margin-right: auto;
}
</style>
