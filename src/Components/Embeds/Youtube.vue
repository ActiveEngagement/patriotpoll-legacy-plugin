<template>
    <div>
        <iframe :src="src" :width="calculatedWidth" :height="calculatedHeight" class="youtube-embed" type="text/html" frameborder="0" @load="$emit('loaded')"/>
    </div>
</template>

<script>
export default {

    inheritAttrs: false,

    name: 'youtube',

    props: {

        id: {
            type: String,
            required: true
        },

        controls: {
            type: Boolean,
            default: true
        },

        autoplay: {
            type: Boolean,
            default: false
        },

        start: Number,

        end: Number,

        width: Number,

        height: Number

    },

    computed: {

        src() {
            return `https://www.youtube.com/embed/${this.id}`;
        }

    },

    methods: {

        resize() {
            if(!this.calculatedWidth) {
                this.calculatedWidth = this.$el.clientWidth;
            }

            this.calculatedHeight = this.$el.clientWidth * (9 / 16);

            return this.resize;
        }

    },

    mounted() {
        window.addEventListener('resize', this.resize());
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },

    data() {
        return {
            calculatedWidth: this.width,
            calculatedHeight: this.height
        }
    }

}
</script>
