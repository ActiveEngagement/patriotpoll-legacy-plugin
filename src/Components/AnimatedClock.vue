<template>
    <animated-icon
        loop
        autoplay
        icon="clock"
        :size="100"
        :speed="1" />
</template>

<script>
import { clock } from '@vue-interface/animated-icon/icons';
import { AnimatedIcon, register } from '@vue-interface/animated-icon';

register({
    clock
});

export default {

    components: {
        AnimatedIcon
    }

};
</script>