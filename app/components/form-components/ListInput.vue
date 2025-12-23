<template>
    <div class="detail-group">
        <label>{{ label }}</label>
        <div 
            class="detail-wrapper" 
            v-for="(item, i) in localItems" 
            :key="i" 
            style="display:flex; gap:8px; align-items:center;"
        >
            <input
                type="text"
                :id="`${idPrefix}_${i}`"
                class="listed-detail"
                :placeholder="placeholder"
                v-model="localItems[i]"
                :class="{ 'loading': disabled }"
                :disabled="disabled"
            />
            <button
                type="button"
                class="detail-button"
                style="padding:10px 14px"
                :class="{ 'loading': disabled }"
                :disabled="disabled"
                @click="removeItem(i)"
            >
                <span class="material-symbols-outlined">delete</span>
            </button>
        </div>
        <div class="detail-wrapper" style="margin-top:8px;">
            <button
                type="button"
                class="detail-button"
                :class="{ 'loading': disabled }"
                :disabled="disabled"
                @click="addItem"
            >
                <span class="material-symbols-outlined">add</span>&nbsp;&nbsp;{{ addButtonText }}
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    modelValue: string[]
    label: string
    placeholder?: string
    addButtonText?: string
    disabled?: boolean
    idPrefix?: string
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', v: string[]): void
}>();

const localItems = computed<string[]>({
    get() {
        return props.modelValue ?? [];
    },
    set(v: string[]) {
        emit('update:modelValue', v);
    }
});

const addItem = () => {
    if (props.disabled) return;
    localItems.value = [...localItems.value, ''];
};

const removeItem = (index: number) => {
    if (props.disabled) return;
    const next = localItems.value.slice();
    next.splice(index, 1);
    localItems.value = next;
};
</script>