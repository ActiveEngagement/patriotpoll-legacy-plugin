<template>
    <select-field
        :name="name"
        :label="fieldLabel"
        :placeholder="fieldLabel"
        :value="value"
        :errors="errors"
        class="focusable"
        custom
        @input="value => $emit('input', value)">
        <option />
        <option v-for="[value, label] in options" :key="value" :value="value">
            {{ label }}
        </option>
    </select-field>
</template>

<script>
import InputField from '@vue-interface/input-field';
import SelectField from '@vue-interface/select-field';

export default {
    components: {
        SelectField
    },
    extends: InputField,
    props: {
        options: {
            type: Array,
            required: true
        }
    }
};
</script>