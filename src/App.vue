<template>
    <div>
        <poll-loader />
    </div>
</template>

<script>
import '@vue-interface/form-control/src/scss/CustomFields.scss';
import PollLoader from './Components/Poll/PollLoader';

export default {
    components: {
        PollLoader
    }
};
</script>