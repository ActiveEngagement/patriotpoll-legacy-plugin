<template>
    <div class="mt-5">
        <h5 class="text-center font-weight-light mb-1">
            Share this poll!
        </h5>
        
        <div class="poll-social-buttons">
            <poll-social-button
                network="Facebook"
                background="#3b5998"
                :url="poll.permalink"
                :title="poll.title"
                :description="poll.content"
                :icon="require('../Icons/Facebook').default" />

            <poll-social-button
                network="Twitter"
                background="#1da1f2"
                :url="poll.permalink"
                :title="poll.title"
                :description="poll.content"
                :icon="require('../Icons/Twitter').default" />

            <poll-social-button
                network="Email"
                background="#DD4F48"
                :url="poll.permalink"
                :title="poll.title"
                :description="poll.content"
                :icon="require('../Icons/Email').default" />
        </div>
    </div>
</template>

<script>
import PollSocialButton from './PollSocialButton';

export default {
    components: {
        PollSocialButton
    },
    props: {
        poll: {
            type: Object,
            required: true
        }
    }
};
</script>

<style>
.poll-social-buttons {
    display: flex;
    padding: 1rem;
    justify-content: center;
}

.poll-social-buttons > :not(:last-child) {
    margin-right: .5rem;
}
</style>