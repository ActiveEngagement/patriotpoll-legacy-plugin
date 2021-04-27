<template>
    <div class="twitter-embed" :style="{maxWidth: `${calculatedWidth}px`}">
        <div v-if="(activity || !loaded) && !image" class="position-relative" :style="{'min-height': '300px'}">
            <activity-indicator
                size="sm"
                type="pulse"
                :min-height="300"
                center />
        </div>

        <blockquote v-if="!activity || image" v-bind="attributes">
            <a :href="url">
                <img-loader v-if="image" :src="image.url || image" :alt="`Screenshot of ${image}.`" class="img-fluid" />
            </a>
        </blockquote>
    </div>
</template>

<script>
import { ActivityIndicator, register, Pulse } from '@vue-interface/activity-indicator';
import { script } from '@vue-interface/utils';
import Embed from './Embed';

register({
    pulse: Pulse
});

export default {

    components: {
        ActivityIndicator
    },

    mixins: [
        Embed
    ],

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
            activity: false,
            calculatedWidth: this.width,
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

    mounted() {
        script('https://platform.twitter.com/widgets.js').then(e => {
            if(window.twttr) {
                window.twttr.ready(twttr => {                
                    twttr.events.bind('loaded', (event) => {                        
                        event.widgets.forEach(widget => {
                            widget.style.marginTop = 0;
                            widget.style.marginBottom = 0;
                        });   

                        this.resize();
                    });
                });
                
                window.twttr.widgets.load().then(() => {
                    this.activity = false;   
                    this.loaded = true;
                    this.resize();            
                });

                window.addEventListener('resize', this.resize());
            }
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

<style>
.twitter-embed {
    width: 100%;
}

.twitter-embed > div {
    margin-left: auto;
    margin-right: auto;
}
</style>
