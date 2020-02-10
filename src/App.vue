<template>
    <div>
        <poll-loader :poll="{}" />
    </div>
</template>

<script>
import PollLoader from './Components/Poll/PollLoader';

export default {
    components: {
        PollLoader
    }
};
</script>

<style lang="scss">
@import 'bootstrap/scss/bootstrap.scss';

/* Style.css overrides */
.text-truncate {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}
</style>