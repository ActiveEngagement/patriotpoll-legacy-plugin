export default {

    inheritAttrs: false,

    props: {

        handle: String,

        height: Number,

        id: {
            type: String,
            required: true
        },

        width: Number,

        poll: {
            type: Object,
            required: true
        }

    },

    computed: {

        image() {
            return this.poll && this.poll.embed ? this.poll.embed.url : null;
        }

    },

    watch: {
        loaded(value) {
            value && this.$emit('loaded');
        }
    },

    data() {
        return {
            calculatedWidth: this.width,
            calculatedHeight: this.height,
            loaded: false,
        };
    }

};