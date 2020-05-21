<template>
    <input-field
        v-model="form[name]"
        :name="name"
        :label="fieldLabel"
        :placeholder="fieldLabel"
        :value="form[name]"
        :errors="errors"
        v-bind="$attrs"
        class="focusable"
        custom />
</template>

<script>
import InputField from 'vue-interface/src/Components/InputField';

export default {
    components: {
        InputField
    },
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
        },
        form: {
            type: Object,
            required: true
        }
    },
    computed: {
        fieldLabel() {
            return `${this.label || this.name}${this.required ? '*' : ''}`;
        }
    }
};
</script>