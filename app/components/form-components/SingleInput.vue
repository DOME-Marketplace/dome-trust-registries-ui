<template>
    <div class="detail-group">
        <label v-if="label">{{ label }}</label>
        <div class="detail-wrapper">
            <input
                :type="type"
                :id="id"
                :class="{ 'loading': loading, 'disabled': disabled }"
                :disabled="disabled"
                :required="required"
                :placeholder="placeholder"
                :tabindex="tabindex"
                v-model="model"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        modelValue?: string
        label?: string
        placeholder?: string
        id?: string
        type?: string
        tabindex?: number
        disabled?: boolean
        loading?: boolean
        required?: boolean
    }>(),
    {
        type: 'text'
    }
);

const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void;
}>();

const model = computed<string>({
    get() {
        return props.modelValue ?? ''
    },
    set(value: string) {
        emit('update:modelValue', value)
    }
});
</script>