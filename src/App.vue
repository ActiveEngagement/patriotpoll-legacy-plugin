<template>
    <div>
        <poll-archive :api-key="apiKey" />
    </div>
</template>

<script>
import router from './router';
import PollArchive from './Components/Poll/PollArchive';

export default {
    router,
    components: {
        PollArchive
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