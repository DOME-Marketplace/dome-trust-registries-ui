<template>
    <div class="detail-container">
        <form class="detail-form">
            <SingleInput
                label="DID"
                id="participant_did"
                placeholder="DID"
                v-model="participant.did"
                required
                :disabled="update_registry || isLoading"
                :loading="isLoading"
                :tabindex="update_registry ? -1 : 0"
            />
        </form>
        <div class="detail-button-group">
            <button class="detail-button" :class="{ 'loading': isLoading }" v-on:click="saveRegistry">
                <span class="material-symbols-outlined">save_as</span>&nbsp;&nbsp;Save
            </button>
            <button class="detail-button" style="color: var(--error-color)" :class="{ 'loading': isLoading || !update_registry }" v-on:click="deleteRegistry">
                <span class="material-symbols-outlined">delete_forever</span>&nbsp;&nbsp;Delete
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { apiRequest, checkValidAttributes, makeCursorWait, pageBack, stopCursorWaiting } from '~/assets/scripts/utils';
import type { DetailsProps, Participant } from '~/assets/types/types';
import SingleInput from '../form-components/SingleInput.vue';

const update_registry: Ref<boolean> = ref(false);
const url: Ref<string> = ref('');
const participant: Ref<Participant> = ref({});
const isLoading: Ref<boolean> = ref(false);
const props = defineProps<DetailsProps>();
const route = useRoute();
const router = useRouter();

watch(
    () => [props.url, props.registry],
    async ([props_url, props_registry]) => {
        url.value = props_url as string;
        if(props_registry == undefined) return;
        participant.value = props_registry as Participant;
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
        emit('saving-details');
        makeCursorWait();
        if(!url.value) throw 'Empty URL';
        if(!checkValidAttributes(participant.value)) throw 'The inserted values are not valid';
        let method: string;
        if (update_registry.value) method = 'PUT';
        else method = 'POST';
        const target_url = update_registry.value ? url.value + '/' + participant.value.did : url.value;
        const response = await apiRequest(
            target_url,
            method,
            participant.value
        );
        window.alert('Participant saved successfully');
        emit('close-details');
    } catch (error) {
        window.alert(error);
    } finally {
        isLoading.value = false;
        stopCursorWaiting();
        emit('details-saved');
    }
}

const deleteRegistry = async() => {
    if(isLoading.value) return;
    try{
        isLoading.value = true;
        if(!url.value) throw 'Empty URL';
        if(!checkValidAttributes(participant.value)) throw 'The inserted values are not valid';
        let method: string;
        if (update_registry.value) method = 'PUT';
        else method = 'POST';
        const target_url = update_registry.value ? url.value + '/' + participant.value.did : url.value;
        const response = await apiRequest(
            target_url,
            method,
            participant.value
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