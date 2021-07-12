<template>
    <div>
        <poll-loader>
            <template #results-after-chart>
                results-after-chart
            </template>
            <template #results-after-social-buttons>
                results-after-social-buttons
            </template>
            <template #results-after-next-poll>
                results-after-next-poll
            </template>
        </poll-loader>
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