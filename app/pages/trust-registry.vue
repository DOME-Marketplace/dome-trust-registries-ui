<template>
    <div id="trusted-lists-body">
        <div id="trusted-lists-list">
            <img src="@/assets/images/DOME_Logo_White_Name.svg" 
            style="
            width: 60%; 
            height: auto;
            margin-bottom: 5vh;
            align-self: center;
            "
            />
            <div v-for="item in trustedLists" :class="listItemClass(item)" v-on:click="selectRegistry(item.id)" tabindex="0">{{ item.label }}</div>
        </div>
        <div id="trusted-lists-content">
            <TrustRegistryContent :key="$route.fullPath + '-' + selected" :registry_config="getSelectedRegistry()"
            @open-details="openDetails" ref="content"/>
        </div>
        <div>
            <transition name="details-fade">
                <div v-if="showDetails" class="modal-overlay">
                    <transition name="details-transition">
                        <div class="modal-card" v-if="showDetails">
                            <div v-if="loadingDetails" class="modal-loading">
                                Loading...
                            </div>
                            <div v-else>
                                <DetailsComponent 
                                :registry="detailsId ? detailsData : undefined" 
                                :url="detailsUrl" 
                                :title="getSelectedRegistry()?.label ?? ''"
                                :type="getSelectedRegistry()?.id ?? ''"
                                @close="closeDetails"
                                @save="closeSavedDetails"/>
                            </div>
                        </div>
                    </transition>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { trustedRegistry } from '~/assets/config/trusted-registry';
import type { RegistryConfiguration } from '~/assets/types/types';
import TrustRegistryContent from '~/components/TrustRegistryContent.vue';
import { apiRequest } from '~/assets/scripts/utils';
import DetailsComponent from '~/components/DetailsComponent.vue';

const host: Ref<string> = ref('');
const url: Ref<string> = ref('');
const trustedLists: Ref<RegistryConfiguration[]> = ref([]);
const selected: Ref<string> = ref('');

const showDetails: Ref<boolean> = ref(false);
const detailsId: Ref<string | undefined> = ref();
const detailsData: Ref<any> = ref({});
const detailsUrl: Ref<string> = ref('');
const loadingDetails: Ref<boolean> = ref(false);

const router = useRouter();
const route = useRoute();

const content = ref<InstanceType<typeof TrustRegistryContent> | null>(null);

onMounted(() => {
    host.value = trustedRegistry.host;
    url.value = trustedRegistry['main-uri'];
    trustedLists.value = trustedRegistry['trusted-lists'];
    const hash = window.location.hash;
    if(hash) {
        selected.value = hash.split("#/")[1] ?? '';
    }else{
        selected.value = trustedLists.value[0]?.id ?? '';
    }

    window.location.hash = selected.value;
});

const listItemClass = (item: RegistryConfiguration): string => {
    let itemClass: string = 'trusted-list-item';
    if (item.id === selected.value) itemClass += ' selected';
    return itemClass;
};

const selectRegistry = (id: string): void => {
    selected.value = id;
};

const getSelectedRegistry = (): RegistryConfiguration|undefined => {
    return trustedLists.value.find(registry => registry.id === selected.value);
};

const openDetails = async(payload: { id?: string, type?: string }) => {
    const config = trustedLists.value.find(item => item.id === (payload.type ?? selected.value));
    if (!config) return;
    detailsUrl.value = trustedRegistry.host + trustedRegistry['main-uri'] + config.uri;
    detailsId.value = payload.id;
    detailsData.value = {};
    showDetails.value = true;

    if(payload.id){
        loadingDetails.value = true;
        try{
            detailsData.value = await apiRequest(detailsUrl.value + '/' + payload.id, 'GET');
        } catch (error) {
            window.alert(error);
            showDetails.value = false;
        } finally {
            loadingDetails.value = false;
        }
    }
};

const closeDetails = () => {
    showDetails.value = false;
    router.replace({})
};

const closeSavedDetails = () => {
    content.value?.getListFromAPI();
    showDetails.value = false;
    router.replace({})
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
    padding: 10vw 0vh;
    z-index: 2;
    display: flex;
    flex-direction: column;
}

#trusted-lists-content{
    overflow: auto;
    min-height: 0;
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
    transition: all .3s ease;
}

#trusted-lists-content{
    background-color: var(--dome-blue-light);
    flex: 4;
    z-index: 1;
}



.modal-overlay{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 8vh;
    z-index: 9999;
}
.modal-card{
    /* width: min(800px, 90vw); */
    background: var(--dome-blue);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    padding: 24px;
    max-height: 80vh;
    overflow: auto;
}
.details-fade-enter-active, .details-fade-leave-active{ transition: opacity .25s ease; }
.details-fade-enter-from, .details-fade-leave-to{ opacity: 0; }
.details-transition-enter-active, .details-transition-leave-active{ transition: transform .28s ease, opacity .28s ease; }
.details-transition-enter-from, .details-transition-leave-to{ transform: translateY(-30vh); opacity: 0.5; }
.modal-loading{ color: var(--dome-blue-light); font-weight: bold; padding: 16px; text-align: center; }

a{
    text-decoration: none;
}
</style>