<template>
    <div id="trusted-lists-body">
        <div id="trusted-lists-list">
            <div v-for="item in trustedLists" :class="listItemClass(item)" v-on:click="selectRegistry(item.id)">{{ item.label }}</div>
        </div>
        <div id="trusted-lists-content"></div>
    </div>
</template>

<script setup lang="ts">
import { trustedRegistry } from '~/assets/config/trusted-registry';
import type { RegistryConfiguration } from '~/assets/types/types';

const host: Ref<string> = ref('');
const url: Ref<string> = ref('');
const trustedLists: Ref<RegistryConfiguration[]> = ref([]);
const selected: Ref<string> = ref('');

onMounted(() => {
    host.value = trustedRegistry.host;
    url.value = trustedRegistry['main-uri'];
    trustedLists.value = trustedRegistry['trusted-lists'];
    selected.value = trustedLists.value[0]?.id ?? '';
});

const listItemClass = (item: RegistryConfiguration): string => {
    let itemClass: string = 'trusted-list-item';
    if (item.id === selected.value) itemClass += ' selected';
    return itemClass;
};

const selectRegistry = (id: string): void => {
    selected.value = id;
}

</script>

<style scoped>
#trusted-lists-body{
    width: 100vw;
    height: 100vh;
    display: flex;
}

#trusted-lists-list{
    background-color: var(--dome-blue);
    flex: 1;
    padding: 15vw 0vh;
    z-index: 2;
}

.trusted-list-item{
    padding: 2vh 1vw;
    font-size: 18px;
    color: var(--dome-blue-light);
    cursor: pointer;
    position: relative;
    transition: 
        margin 0.5s ease-out,
        padding 0.5s ease-out, 
        font-size 0.2s ease, 
        font-weight 0.2s ease;
}

.trusted-list-item:not(.selected){
    z-index: 2;
}

.trusted-list-item.selected{
    background-color: var(--dome-blue-light);
    color: var(--dome-blue);
    border-radius: 10px 0px 0px 10px;
    padding-left: 1.5vw;
    margin-left: .5vw;
    z-index: 1;
    font-size: 20px;
    font-weight: bold;
}

#trusted-lists-content{
    background-color: var(--dome-blue-light);
    flex: 4;
    z-index: 1;
}
</style>