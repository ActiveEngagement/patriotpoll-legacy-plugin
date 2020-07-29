<template>
    <div>
        <poll-archive />
    </div>
</template>

<script>
import { PollArchive } from './Components/Poll';
import PatriotPollPlugin from './Plugins/PatriotPollPlugin';

export default {
    components: {
        PollArchive
    },
    created() {
        this.$root.constructor.use(PatriotPollPlugin, {
            apiKey: this.apiKey,
            baseUrl: this.baseUrl
        });
    },

};
</script>