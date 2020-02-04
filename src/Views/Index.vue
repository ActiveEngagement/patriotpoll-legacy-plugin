<template>
    <div v-if="error">
        <div class="position-absolute d-flex justify-content-center align-items-center w-100 h-100">
            <alert variant="danger" style="min-width: 50%">
                <h3 class="font-weight-light">
                    {{ error.exception }}
                </h3>
                <p>Line: {{ error.line }} {{ error.message }}</p>
            </alert>
        </div>
    </div>

    <div v-else style="padding-bottom: 600px">
        <poll
            :id="id"
            :step="step"
            max-width="520px"
            api-key="$2y$10$GPHLvsJj4Ad3gxm/eJlvZO2MyrEClWZyjx4hwl5R686Y0.S8QNfbe"
            @load="onLoad"
            @step="onStep"
            @toggle-loading="onToggleLoading"
            @error="onError" />
    </div>
</template>

<script>
import Poll from '@/Components/Poll';
import Alert from 'vue-interface/src/Components/Alert';

export default {

    name: 'Index',

    components: {
        Poll,
        Alert
    },

    data() {
        return {
            step: null,
            error: null,
            id: this.$route.params.id
        };
    },

    watch: {

        id() {
            this.updateRoute();
        },

        step() {
            this.updateRoute();
        },

        '$route.params.id': function(value) {
            this.error = null;
            this.id = value;
        },

        '$route.params.step': function(value) {
            this.step = value;
        }

    },

    mounted() {
        if(this.$route.params.step) {
            this.step = this.$route.params.step;
        }
    },

    methods: {

        updateRoute() {
            this.$router.push({
                name: 'poll', params: {
                    id: this.id, step: this.step
                }
            });
        },

        onToggleLoading(value) {
            this.$emit('toggle-loading', value);
        },

        onLoad(model) {
            this.id = model.id;
        },

        onStep(step) {
            this.step = step;
        },

        onError(response) {
            this.error = response.data;
        }

    }

};
</script>