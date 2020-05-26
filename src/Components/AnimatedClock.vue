<template>
    <animated-icon
        loop
        autoplay
        icon="clock"
        :size="100"
        :speed="1" />
</template>

<script>
import { register } from '@vue-interface/animated-icon';
import { clock } from '@vue-interface/animated-icon/icons';

register({
    clock
});

export default {

    components: {
        AnimatedIcon: () => import(/* webpackChunkName: 'animated-icon' */ '@vue-interface/animated-icon')
    }

};
</script>