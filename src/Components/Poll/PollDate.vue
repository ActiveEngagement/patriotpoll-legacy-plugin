<template>
    <div class="poll-date mt-2 pt-1 mb-3 pb-1">
        {{ poll.published_at | date('MMMM D, YYYY') }}
    </div>
</template>

<script>
import DateFilter from 'vue-interface/src/Filters/Date/DateFilter';

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

<style lang="scss">
@import '../../assets/scss/mixins';
@import '../../assets/scss/variables';

.poll-date {
    @include body-font;
    background-color: transparent;
    color: $primary-red;
    font-size: 15px;
    text-transform: uppercase;
    text-align: center;
    font-weight: 700;
    letter-spacing: 1px;
}
</style>