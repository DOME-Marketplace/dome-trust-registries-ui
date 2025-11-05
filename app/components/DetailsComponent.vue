<template>
    <div class="registry-details">
        <div id="details-header">
            <span class="material-icons arrow-back" :class="{ 'loading': isLoading }" tabindex="0" @click="closeDetails">close</span>
            <div id="details-title">{{ title }}</div>
        </div>
        <div id="details-body">
            <AccessNodeDetails
                :registry="registry"
                :url="url"
                @close-details="closeSavedDetails"
                @saving-details="startLoading"
                @details-saved="stopLoading"
                v-if="type === 'access-nodes'"
            />
            <ParticipantDetails
                :registry="registry"
                :url="url"
                @close-details="closeSavedDetails"
                @saving-details="startLoading"
                @details-saved="stopLoading"
                v-if="type === 'participants'"
            />
            <SchemaDetails
                :registry="registry"
                :url="url"
                @close-details="closeSavedDetails"
                @saving-details="startLoading"
                @details-saved="stopLoading"
                v-if="type === 'schemas'"
            />
            <ServiceDetails
                :registry="registry"
                :url="url"
                @close-details="closeSavedDetails"
                @saving-details="startLoading"
                @details-saved="stopLoading"
                v-if="type === 'services'"
            />
            <IssuerDetails
                :registry="registry"
                :url="url"
                @close-details="closeSavedDetails"
                @saving-details="startLoading"
                @details-saved="stopLoading"
                v-if="type === 'issuers'"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import AccessNodeDetails from '~/components/detail-components/AccessNodeDetails.vue';
import ParticipantDetails from './detail-components/ParticipantDetails.vue';
import SchemaDetails from './detail-components/SchemaDetails.vue';
import ServiceDetails from './detail-components/ServiceDetails.vue';
import IssuerDetails from './detail-components/IssuerDetails.vue';

const router = useRouter();

const props = defineProps<{
    title: string,
    url: string,
    registry?: any,
    type: string
}>();

const isLoading: Ref<boolean> = ref(false);

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save'): void;
}>();

const closeDetails = () => {
    if(isLoading.value) return;
    emit('close');
};

const closeSavedDetails = () => {
    emit('save');
}

const startLoading = () => {
    isLoading.value = true;
}

const stopLoading = () => {
    isLoading.value = false;
}
</script>

<style scoped>
.registry-details{
    height: auto;
    width: 100%;
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
    padding-top: 2vh;
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
    /* position: absolute; */
    border-radius: 50%;
    outline: none;
    background-color: var(--dome-blue);
    color: var(--dome-blue-light);
    font-weight: bold;
    font-size: 30px;
    padding: 1vh;
    transition: all 0.3s ease;
    z-index: 2;
}

.arrow-back:not(.loading):hover,
.arrow-back:not(.loading):focus,
.arrow-back:not(.loading):active{
    /* font-size: 35px; */
    box-shadow: 
        inset 5px 5px 10px var(--dome-shadow-dark),
        inset -5px -5px 10px var(--dome-shadow-light);
    background-color: var(--dome-blue-light);
    color: var(--dome-blue);
    transform: translateY(2px);
}
</style>