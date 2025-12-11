<template>
    <div class="pages-container">
        <!-- Go to first -->
        <span tabindex="0" class="material-symbols-outlined pages-arrow" v-on:click="goToFirst" :class="{ 'disabled': !hasPages()}">keyboard_double_arrow_left</span>
        <!-- Go to prev -->
        <span tabindex="0" class="material-symbols-outlined pages-arrow" v-on:click="goToPrev" :class="{ 'disabled': !hasPages()}">keyboard_arrow_left</span>
        <!-- Go to index -->
        <div v-for="index in pages" class="pages-index" :class="{ 'current': isCurrentIndex(index), 'disabled': !hasPages()}" v-on:click="goTo(index)" tabindex="0">{{ index }}</div>
        <!-- Go to next -->
        <span tabindex="0" class="material-symbols-outlined pages-arrow" v-on:click="goToNext" :class="{ 'disabled': !hasPages()}">keyboard_arrow_right</span>
        <!-- Go to last -->
        <span tabindex="0" class="material-symbols-outlined pages-arrow" v-on:click="goToLast" :class="{ 'disabled': !hasPages()}">keyboard_double_arrow_right</span>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{total: number}>();
const pages: Ref<number> = ref(0);
const current: Ref<number> = ref(1);

const emit = defineEmits<{
    (event: 'first'): void;
    (event: 'last'): void;
    (event: 'next'): void;
    (event: 'prev'): void;
    (event: 'index', payload: { index: number }): void;
}>();

watch(
    () => props.total,
    () => {
        pages.value = props.total;
    },
    { immediate: true }
);

const goToFirst = () => {
    current.value = 1;
    emit('first');
}

const goToLast = () => {
    current.value = pages.value;
    emit('last');
}

const goToNext = () => {
    if(current.value === pages.value) return;
    current.value += 1;
    emit("next");
}

const goToPrev = () => {
    if (current.value === 1) return;
    current.value -= 1;
    emit("prev");
}

const goTo = (index: number) => {
    current.value = index;
    emit('index', { index: index });
}

const hasPages = (): boolean => {
    return pages.value > 1;
}

const isCurrentIndex = (index: number): boolean => {
    return current.value === index
}

</script>

<style scoped>
.pages-container{
    display: flex;
    justify-content: end;
    align-items: center;
}

.pages-arrow{
    color: var(--dome-blue);
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    transition: all .3s ease;
}

.pages-arrow:not(.disabled):focus{
    box-shadow: 
        5px 5px 10px var(--dome-shadow-dark),
        -5px -5px 10px var(--dome-shadow-light);
    transform: translateY(-2px);
}

.pages-arrow:not(.disabled):hover{
    box-shadow: 
        5px 5px 10px var(--dome-shadow-dark),
        -5px -5px 10px var(--dome-shadow-light);
    transform: translateY(-2px);
}

.pages-index{
    color: var(--dome-blue);
    padding: 5px 10px;
    margin: 2.5px 5px;
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    transition: all .3s ease;
}

.current:not(.disabled){
    font-weight: bold;
    box-shadow: 
        5px 5px 10px var(--dome-shadow-dark),
        -5px -5px 10px var(--dome-shadow-light);
}

.current:not(.disabled):focus{
    background-color: var(--dome-focused-blue);
}

.pages-index:not(.disabled):focus{
    box-shadow: 
        5px 5px 10px var(--dome-shadow-dark),
        -5px -5px 10px var(--dome-shadow-light);
    transform: translateY(-2px);
}

.pages-index:not(.disabled):hover{
    box-shadow: 
        5px 5px 10px var(--dome-shadow-dark),
        -5px -5px 10px var(--dome-shadow-light);
    transform: translateY(-2px);
}

.disabled{
    cursor: default;
    color: var(--dome-shadow-dark);
}
</style>