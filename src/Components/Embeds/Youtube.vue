<template>
    <div>
        <iframe :src="src"
            :width="calculatedWidth"
            :height="calculatedHeight"
            class="youtube-embed"
            type="text/html"
            frameborder="0"
            @load="$emit('loaded')" />
    </div>
</template>

<script>
export default {

    name: 'Youtube',

    inheritAttrs: false,

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

        height: Number

    },

    data() {
        return {
            calculatedWidth: this.width,
            calculatedHeight: this.height
        };
    },

    computed: {

        src() {
            return `https://www.youtube.com/embed/${this.id}`;
        }

    },

    mounted() {
        window.addEventListener('resize', this.resize());
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },

    methods: {

        resize() {
            this.calculatedWidth = this.width || this.$el.clientWidth;
            this.calculatedHeight = this.calculatedWidth * (9 / 16);

            return this.resize;
        }

    }

};
</script>
