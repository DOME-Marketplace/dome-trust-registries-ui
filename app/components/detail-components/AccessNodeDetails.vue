<template>
    <div class="detail-container">
        <form class="detail-form">
            <single-input
                label="DLT Address"
                id="dlt_address"
                placeholder="Address" 
                v-model="accessNode.dlt_address"
                required
                :disabled="update_registry || isLoading"
                :loading="isLoading"
                :tabindex="update_registry ? -1 : 0"
            />
            <single-input
                label="Name"
                id="name"
                placeholder="Name"
                v-model="accessNode.name"
                required
                :disabled="isLoading"
                :loading="isLoading"
            />
        </form>
        <div class="detail-button-group">
            <button class="detail-button" :class="{ 'loading': isLoading }" v-on:click="saveRegistry">
                <span class="material-symbols-outlined">save_as</span>&nbsp;&nbsp;Save
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { apiRequest, checkValidAttributes, makeCursorWait, pageBack, stopCursorWaiting } from '~/assets/scripts/utils';
import type { AccessNode, DetailsProps } from '~/assets/types/types';
import SingleInput from '../form-components/SingleInput.vue';
import { useAuthStore } from '~/assets/scripts/pinia';

const update_registry: Ref<boolean> = ref(false);
const url: Ref<string> = ref('');
const accessNode: Ref<AccessNode> = ref({});
const isLoading: Ref<boolean> = ref(false);
const props = defineProps<DetailsProps>();
const route = useRoute();
const router = useRouter();
const token = useAuthStore().access_token;

watch(
    () => [props.url, props.registry],
    async ([props_url, props_registry]) => {
        url.value = props_url as string;
        if(props_registry == undefined) return;
        accessNode.value = props_registry as AccessNode;
        update_registry.value = Boolean(route.query.id);
    },
    { immediate: true }
);

watch(
    () => route.query.id,
    (id) => {
        update_registry.value = !!id;
    },
    {
        immediate: true
    }
);

const saveRegistry = async() => {
    if(isLoading.value) return;
    try{
        isLoading.value = true;
        makeCursorWait();
        emit('saving-details');
        if(!url.value) throw 'Empty URL';
        if(!checkValidAttributes(accessNode.value)) throw 'The inserted values are not valid';
        let method: string;
        if (update_registry.value) method = 'PUT';
        else method = 'POST';
        const target_url = update_registry.value ? url.value + '/' + accessNode.value.dlt_address : url.value;
        const response = await apiRequest(
            target_url,
            method,
            accessNode.value,
            {
                'Authorization': `Bearer ${token?.access_token}`
            }
        );
        window.alert('Access Node saved successfully');
        emit('close-details');
    } catch (error) {
        window.alert(error);
        emit('details-saved');
    } finally {
        isLoading.value = false;
        stopCursorWaiting();
        emit('details-saved');
    }
}

const emit = defineEmits<{
    (event: 'close-details'): void;
    (event: 'saving-details'): void;
    (event: 'details-saved'): void;
}>();
</script>