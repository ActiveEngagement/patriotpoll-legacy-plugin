<template>
    <div>
        <poll-loader :id="39" :api-key="apiKey" />
    </div>
</template>

<script>
import PollLoader from './Components/Poll/PollLoader';

export default {
    components: {
        PollLoader
    },
    props: {
        apiKey: {
            type: String,
            default() {
                return process.env.VUE_APP_API_KEY;
            }
        }
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