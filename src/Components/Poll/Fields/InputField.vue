<template>
    <input-field
        :name="name"
        :label="fieldLabel"
        :placeholder="fieldLabel"
        :value="currentValue"
        :errors="errors"
        v-bind="$attrs"
        class="focusable"
        custom
        @input="value => $emit('input', value)" />
</template>

<script>
import FormControl from '@vue-interface/form-control';
import InputField from '@vue-interface/input-field';

export default {
    components: {
        InputField
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