<template>
    <select-field
        v-model="form[name]"
        :name="name"
        :label="fieldLabel"
        :placeholder="fieldLabel"
        :value="form[name]"
        :errors="errors"
        class="focusable"
        custom>
        <option />
        <option v-for="[value, label] in options" :key="value" :value="value">
            {{ label }}
        </option>
    </select-field>
</template>

<script>
import InputField from './InputField';
import SelectField from 'vue-interface/src/Components/SelectField';

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