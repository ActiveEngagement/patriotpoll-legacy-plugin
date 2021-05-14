<template>
    <div :class="Object.assign(classes, {[`line-breaks-${lineBreaks}`]: !!lineBreaks})">
        <h1 ref="h1" v-resize class="poll-header text-center">
            <span>{{ poll.question }}</span>
        </h1>
    </div>
</template>

<script>
import { totalLineBreaks } from '../../Helpers/Text';

export default {

    directives: {
        
        resize: {
            bind(el, binding, vnode) {
                window.addEventListener('resize', vnode.context.resizer = () => {
                    vnode.context.onResize();
                });    
            },
            inserted(el, binding, vnode) {
                vnode.context.lineBreaks = totalLineBreaks(el);
            },
            unbind(el, binding, vnode) {
                window.removeEventListener('resize', vnode.context.resizer);
            }
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
                'px-md-3': this.lineBreaks <= 2,
                'mx-md-5': this.lineBreaks <= 3,
                'mx-md-3': this.lineBreaks === 4,
                'mx-md-2': this.lineBreaks >= 5,
            };
        }
    },

    methods: {
        onResize(e) {
            this.lineBreaks = totalLineBreaks(this.$refs.h1);
        }
    }

};
</script>