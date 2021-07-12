<template>
    <input-field
        :name="name"
        :label="fieldLabel"
        :placeholder="fieldLabel"
        :value="value"
        :errors="errors"
        v-bind="$attrs"
        class="focusable"
        custom
        @input="value => $emit('input', value)" />
</template>

<script>
import FormControl from '@vue-interface/form-control';

export default {
    components: {
        InputField: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/input-field')
    },
    mixins: [
        FormControl
    ],
    props: {
        label: String,
        required: Boolean,
        name: {
            type: String,
            required: true
        },
        errors: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    computed: {
        fieldLabel() {
            return `${this.label || this.name}${this.required ? '*' : ''}`;
        }
    }
};
</script>