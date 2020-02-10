<template>
    <div>
        test
    </div>    
</template>

<script>
const SUPPORTED = !!window.customElements;

import Vue from 'vue';
import PollLoader from './PollLoader';
import wrap from '@vue/web-component-wrapper';

export default {

    components: {
        // PollLoader
    },

    inheritAttrs: false,

    props: {
        element: {
            type: String,
            default: 'poll-widget'
        }  
    },
    
    mounted() {
        if(SUPPORTED) {
            window.customElements.define(this.element, wrap(Vue, PollLoader));
        }
    }

};
</script>