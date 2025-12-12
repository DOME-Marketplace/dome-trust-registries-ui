<template>
    <div class="registry-details">
        <div id="details-header">
            <span class="material-icons arrow-back" tabindex="0" v-on:click="pageBack('/trust-registry')">arrow_back</span>
            <div id="details-title">{{ configuration?.label }}</div>
        </div>
        <div id="details-body">
            <AccessNodeDetails :registry="editing ? data : undefined" :url="registry_url"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { trustedRegistry } from '~/assets/config/trusted-registry';
import { useAuthStore } from '~/assets/scripts/pinia';
import { apiRequest, pageBack } from '~/assets/scripts/utils';
import type { AccessNode, LEARCredentialIssuer, Participant, RegistryConfiguration, Schema, Services } from '~/assets/types/types';

const query_id: Ref<string> = ref('');
const query_type: Ref<string> = ref('');
const route = useRoute();
const router = useRouter();
const token = useAuthStore().access_token;
let configuration: RegistryConfiguration | undefined;
const trustedLists: Ref<RegistryConfiguration[]> = ref([]);
const data: Ref<
    AccessNode |
    LEARCredentialIssuer |
    Participant |
    Schema |
    Services
> = ref({});
const editing: Ref<boolean> = ref(false);
const registry_url: Ref<string> = ref('');

onBeforeMount(async() => {
    query_id.value = route.query.id as string;
    query_type.value = route.query.type as string;
    trustedLists.value = trustedRegistry()['trusted-lists'];
    configuration = trustedLists.value.find(item => item.id === query_type.value);
    registry_url.value = trustedRegistry().host + trustedRegistry()['main-uri'] + configuration?.uri;
    if(query_id.value) {
        editing.value = true;
        await getDetailsFromAPI();
    }
});

const getDetailsFromAPI = async ():Promise<void> => {
    console.table(query_id);
    const url = registry_url.value + '/' + query_id.value;
    data.value = await apiRequest(
        url, 
        'GET',
        undefined,
        {
            'Authorization': `Bearer ${token?.access_token}`
        }
    );
}
</script>

<style scoped>
.registry-details{
    height: 100vh;
    width: 100vw;
    background-color: var(--dome-blue);
    display: flex;
    flex-direction: column;
    align-items: center;
}

#details-header{
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 5vh;
}

#details-title{
    color: var(--dome-blue-light);
    font-weight: bold;
    font-size: 30px;
    border-radius: 15px;
    padding: 1vh 2vw;
}

#details-body{
    padding: 2vh 2vw;
}

.arrow-back{
    cursor: pointer;
    position: fixed;
    top: 5vh;
    left: 20vw;
    border-radius: 50%;
    outline: none;
    background-color: var(--dome-blue);
    color: var(--dome-blue-light);
    font-weight: bold;
    font-size: 30px;
    padding: 1vh;
    transition: all 0.3s ease;
}

.arrow-back:hover,
.arrow-back:focus,
.arrow-back:active{
    font-size: 35px;
    background-color: var(--dome-blue-light);
    color: var(--dome-blue);
}
</style>