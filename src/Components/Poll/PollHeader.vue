<template>
    <div :class="classes">
        <h1 v-resize class="poll-header text-center">
            <span>{{ poll.question }}</span>
        </h1>
    </div>
</template>

<script>
import { totalLineBreaks } from '../../Helpers/Text';

export default {

    directives: {
        
        resize(el, binding, vnode) {
            vnode.context.$nextTick(() => {
                vnode.context.lineBreaks = totalLineBreaks(el);
            });
        }
    
    },

    props: {

        poll: {
            type: Object,
            required: true
        }

    },

    data: () => ({
        lineBreaks: null
    }),

    computed: {
        classes() {
            return {
                [`line-breaks-${this.lineBreaks}`]: true,
                'mx-lg-5': this.lineBreaks < 3,
                'mx-lg-3': this.lineBreaks === 4,
                'mx-lg-2': this.lineBreaks >= 5,
            };
        }
    }

};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';
@import '../../assets/scss/variables';

.poll-title {
    
}
</style>