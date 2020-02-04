<template>
    <div class="w-100" :style="{maxWidth: `${calculatedWidth}px`}">
        <div v-if="(activity || !loaded) && !image" class="position-relative" :style="{'min-height': '300px'}">
            <activity-indicator size="sm" type="spinner" label="Loading Twitter..." :min-height="200" center/>
        </div>

        <blockquote v-if="!activity" v-instantiate v-bind="attributes" :style="{'visibility': !loaded ? 'hidden' : 'visible'}">
            <a :href="url">
                <img v-if="image" :src="image.url || image" :alt="`Screenshot of ${image}.`" class="img-fluid"/>
            </a>
        </blockquote>
    </div>
</template>

<script>
import script from 'vue-interface/src/Helpers/Script';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

export default {

    inheritAttrs: false,

    name: 'twitter',

    components: {
        ActivityIndicator
    },

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

    directives: {
        instantiate: {
            inserted(el, binding, vnode) {

                vnode.context.$nextTick(() => {
                    vnode.context.$twttr.widgets.load(el).then(() => {
                        vnode.context.$el.querySelector('twitterwidget, .twitter-tweet').style.marginTop = 0;
                        vnode.context.$el.querySelector('twitterwidget, .twitter-tweet').style.marginBottom = 0;
                        vnode.context.loaded = true;
                    });
                });
            }
        }
    },

    watch: {
        loaded(value) {
            if(value) {
                this.$emit('loaded');
            }
        }
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

    methods: {

        resize() {
            if(!this.width) {
                this.calculatedWidth = Math.min(this.$el.clientWidth, 550);
            }

            return this.resize;
        }

    },

    mounted() {
        script('https://platform.twitter.com/widgets.js').then(() => {
            window.twttr.ready(twttr => {
                this.$twttr = twttr;
                this.activity = false;
                this.$nextTick();

                window.addEventListener('resize', this.resize());
            });
        });
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },

    data() {
        return {
            loaded: false,
            activity: true,
            calculatedWidth: this.width
        }
    }

}
</script>
