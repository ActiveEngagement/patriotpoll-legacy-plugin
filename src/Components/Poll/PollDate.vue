<template>
    <div class="poll-date mt-2 pt-1 mb-3 pb-1">
        {{ poll.published_at | date('MMMM D, YYYY') }}
    </div>
</template>

<script>
import { DateFilter } from 'vue-interface/src/Filters/Date';

export default {

    name: 'PollDate',

    filters: {
        'date': DateFilter
    },

    props: {

        poll: {
            type: Object,
            required: true
        }

    }

};
</script>