<template>
    <select-field
        :name="name"
        :label="fieldLabel"
        :placeholder="fieldLabel"
        :value="currentValue"
        :errors="errors"
        class="focusable"
        custom
        @input="value => $emit('input', value)">
        <option />
        <option v-for="[ value, optionLabel ] in options" :key="value" :value="value">
            {{ optionLabel }}
        </option>
    </select-field>
</template>

<script>
import FormControl from '@vue-interface/form-control';

export default {
    components: {
        SelectField: () => import(/* webpackChunkName: 'vue-interface', webpackPrefetch: true */'@vue-interface/select-field')
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
        },
        options: {
            type: Array,
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