<template>
    <div class="content-container" v-if="registry_config">
        <div id="content-header">
            <div id="content-title">{{ registry_config?.label }}</div>
        </div>
        <div id="content-body" v-if="data">
            <div class="registry-container">
                <button class="registry-button" v-on:click="openRegistryDetails()"><span class="material-icons">add_circle</span>Add registry</button>
            </div>
            <div class="registry-container pages">
                <PagesCountComponent 
                :total=totalPages 
                @first="getFirstList"
                @last="getLastList"
                @next="getNextList"
                @prev="getPrevList"
                @index="getIndexList"
                />
            </div>
            <div v-if="data.total" class="registry-container">
                <div class="registry-item" v-for="item in list" v-on:click="openRegistryDetails(item.did)" tabindex="0">
                    <span><div class="material-symbols-outlined">document_search</div>&nbsp;&nbsp;<b>ID:</b>&nbsp;&nbsp;{{ item.did }}</span>
                </div>
            </div>
            <div v-else class="content-failure">
                There are no {{ registry_config.label }} registered yet<br>
                Try adding a new one
            </div>
        </div>
    </div>
    <div class="content-container" v-else>
        <div class="content-failure">No registry configuration found</div>
    </div>
</template>

<script lang="ts" setup>
import type { RegistryConfiguration, RegistrySummary, RegistryPages } from '~/assets/types/types';
import { trustedRegistry } from '~/assets/config/trusted-registry';
import { apiRequest } from '~/assets/scripts/utils';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps<{registry_config: RegistryConfiguration|undefined}>();
const data: Ref<any> = ref();
const list: Ref<RegistrySummary[]> = ref([]);
const router = useRouter();
const route = useRoute();
const pages: Ref<RegistryPages> = ref({});
const totalPages: Ref<number> = ref(1);

const getListFromAPI = async (config: RegistryConfiguration) => {
    try{
        const url = trustedRegistry.host+trustedRegistry['main-uri']+config?.uri;
        console.log("RETRIEVING LIST FROM API: " + url)
        const response = await apiRequest(
            url,
            'GET'
        );
        data.value = response;
        console.log(response); 
        list.value = response.items ?? [];
        pages.value = {
            first: URL.parse(response.links.first) ?? undefined,
            last: URL.parse(response.links.last) ?? undefined,
            next: URL.parse(response.links.next) ?? undefined,
            prev: URL.parse(response.links.prev) ?? undefined
        }
        console.log(pages.value.first)
        totalPages.value = (Number(pages.value.last?.searchParams.get('page[after]')) ?? 0) + 1
    } catch (error) {
        console.error(error);
        console.trace(error);
    }
}

const getFirstList = async () => {
    const response = await apiRequest(
        pages.value.first!.href,
        'GET'
    );
    data.value = response;
    list.value = response.items ?? [];
    pages.value = {
        first: URL.parse(response.links.first) ?? undefined,
        last: URL.parse(response.links.last) ?? undefined,
        next: URL.parse(response.links.next) ?? undefined,
        prev: URL.parse(response.links.prev) ?? undefined
    };
    console.log(response);
}

const getLastList = async () => {
    const response = await apiRequest(
        pages.value.last!.href,
        'GET'
    );
    data.value = response;
    list.value = response.items ?? [];
    pages.value = {
        first: URL.parse(response.links.first) ?? undefined,
        last: URL.parse(response.links.last) ?? undefined,
        next: URL.parse(response.links.next) ?? undefined,
        prev: URL.parse(response.links.prev) ?? undefined
    }
    console.log(response)
}

const getNextList = async () => {
    const response = await apiRequest(
        pages.value.next!.href,
        'GET'
    );
    data.value = response;
    list.value = response.items ?? [];
    pages.value = {
        first: URL.parse(response.links.first) ?? undefined,
        last: URL.parse(response.links.last) ?? undefined,
        next: URL.parse(response.links.next) ?? undefined,
        prev: URL.parse(response.links.prev) ?? undefined
    }
    console.log(response)
}

const getPrevList = async () => {
    const response = await apiRequest(
        pages.value.prev!.href,
        'GET'
    );
    data.value = response;
    list.value = response.items ?? [];
    pages.value = {
        first: URL.parse(response.links.first) ?? undefined,
        last: URL.parse(response.links.last) ?? undefined,
        next: URL.parse(response.links.next) ?? undefined,
        prev: URL.parse(response.links.prev) ?? undefined
    }
    console.log(response)
}

const getIndexList = async (payload: { index: number }) => {
    const url = pages.value.first
    url?.searchParams.set("page[after]", String(payload.index - 1));
    console.log(url?.href)
    const response = await apiRequest(
        url!.href,
        'GET'
    );
    data.value = response;
    list.value = response.items ?? [];
    pages.value = {
        first: URL.parse(response.links.first) ?? undefined,
        last: URL.parse(response.links.last) ?? undefined,
        next: URL.parse(response.links.next) ?? undefined,
        prev: URL.parse(response.links.prev) ?? undefined
    }
    console.log(response)
}

const openRegistryDetails = (id?: string): void => {
    router.replace({
        query: {
            ...route.query,
            id: id
        }
    })
    emit('open-details', { id: id, type: props.registry_config?.id });
}

const emit = defineEmits<{
    (event: 'open-details', payload: { id?: string, type?: string }): void
}>();

watch(
    () => [props.registry_config, route.fullPath],
    async ([config, path]) => {
        try{
            if(config){
                await getListFromAPI(config as RegistryConfiguration);
            }   
        } catch (error) {
            console.error(error);
        }
    },
    { immediate: true }
);
</script>

<style scoped>
.content-container{
    height: 100%;
    width: 100%;
    overflow: auto;
}

.content-failure{
    font-weight: bold;
    font-size: 20px;
    color: var(--error-color);
}

#content-header{
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 5vh;
}

#content-title{
    color: var(--dome-blue);
    font-weight: bold;
    font-size: 30px;
    border-radius: 15px;
    padding: 1vh 2vw;
    box-shadow: 
        5px 5px 10px var(--dome-shadow-dark),
        -5px -5px 10px var(--dome-shadow-light);
}

#content-body{
    padding: 0vh 5vw;
}

.registry-container{
    margin: 2vh 2vw 5vh;
}

.registry-button {
    padding: 16px;
    margin-top: 10px;
    border: none;
    border-radius: 15px;
    background: var(--dome-blue-light);
    color: var(--dome-blue);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
        8px 8px 16px var(--dome-shadow-dark),
        -8px -8px 16px var(--dome-shadow-light);
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    outline: none;
}

.registry-button:hover {
    box-shadow: 
        4px 4px 8px var(--dome-shadow-dark),
        -4px -4px 8px var(--dome-shadow-light);
    transform: translateY(1px);
}

.registry-button:active {
    box-shadow: 
        inset 5px 5px 10px var(--dome-shadow-dark),
        inset -5px -5px 10px var(--dome-shadow-light);
    transform: translateY(2px);
}

.registry-button:focus {
    box-shadow: 
        3px 3px 5px var(--dome-shadow-dark),
        -3px -3px 5px var(--dome-shadow-light);
    transform: translateY(1px);
    background-color: var(--dome-focused-blue);
}

.registry-button *{
    margin: 0 .5vw;
}

.registry-item{
    color: var(--dome-blue);
    border-radius: 10px;
    margin: 3.5vh 0;
    padding: 2vh;
    transition: all 0.3s ease;
    cursor: pointer;
    outline: none;
    box-shadow: 
        8px 8px 16px var(--dome-shadow-dark),
        -8px -8px 16px var(--dome-shadow-light);
}

.registry-item span{
    display: flex;
    align-items: center;
}

.registry-item:hover{
    box-shadow: 
        4px 4px 8px var(--dome-shadow-dark),
        -4px -4px 8px var(--dome-shadow-light);
    transform: translateY(1px);
}

.registry-item:focus{
    box-shadow: 
        4px 4px 8px var(--dome-shadow-dark),
        -4px -4px 8px var(--dome-shadow-light);
    transform: translateY(1px);
    background-color: var(--dome-focused-blue);
}

.registry-item:active {
    box-shadow: 
        inset 3px 3px 5px var(--dome-shadow-dark),
        inset -3px -3px 5px var(--dome-shadow-light);
    transform: translateY(2px);
}

.pages{
    margin: -2vh 2vw -2vh 2vw !important;
}
</style>