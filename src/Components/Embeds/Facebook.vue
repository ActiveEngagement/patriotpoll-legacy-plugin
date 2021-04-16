<template>
    <a v-if="image" :href="poll.url">
        <img-loader
            :src="image"
            :style="{maxWidth: `${calculatedWidth}px`}"
            class="poll-img" />
    </a>
    
    <div v-else class="w-100" :style="{maxWidth: `${calculatedWidth}px`}">
        <div v-if="(activity || !loaded) && !image" class="position-relative" :style="{'min-height': '300px'}">
            <activity-indicator
                size="sm"
                type="pulse"
                label="Loading Post..."
                center />
        </div>

        <img v-if="!loaded" :src="image.url || image" :alt="`Screenshot of ${image}.`" class="img-fluid">

        <div v-if="!activity" v-instantiate class="fb-post-wrapper">
            <div class="fb-post" v-bind="attributes">
                <blockquote :cite="url" class="fb-xfbml-parse-ignore">
                    <a v-if="image" :href="url">
                        <img :src="image.url || image" :alt="`Screenshot of ${image}.`" class="img-fluid">
                    </a>
                </blockquote>
            </div>
        </div>
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

    directives: {
        instantiate: {
            inserted(el, binding, vnode) {
                vnode.context.resize();

                vnode.context.$nextTick(() => {
                    window.FB.XFBML.parse(vnode.context.$el.querySelector('.fb-post-wrapper'), () => {
                        vnode.context.loaded = true;
                    });
                });
            }
        }
    },

    mixins: [
        Embed
    ],

    props: {
        
        showText: {
            type: Boolean,
            default: false
        }

    },

    data() {
        return {
            loaded: false,
            activity: true,
            calculatedWidth: this.width
        };
    },

    computed: {

        url() {
            return `https://www.facebook.com/${this.handle}/posts/${this.id}`;
        },

        attributes() {
            return {
                'data-href': this.url,
                'data-show-text': this.showText,
                'data-width': this.calculatedWidth
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

    created() {
        script('https://connect.facebook.net/en_US/sdk.js').then(() => {
            window.FB.init({
                version : 'v3.1',
                status: true,
                xfbml: false
            });

            this.activity = false;
        });
    },

    mounted() {
        window.addEventListener('resize', this.resize());
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },

    methods: {

        resize() {
            if(!this.width) {
                this.calculatedWidth = Math.min(this.$el.clientWidth, 750);
            }

            return this.resize;
        }

    }

};
</script>
