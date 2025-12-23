<template>
    <div class="detail-container">
        <form class="detail-form">
            <single-input
                label="Schema ID"
                id="schema_id"
                placeholder="ID"
                v-model="schema.id"
                required
                :disabled="update_registry || isLoading"
                :loading="isLoading"
                :tabindex="update_registry ? -1 : 0"
            />
            <div class="detail-group">
                <label>Data</label>
                <div class="detail-wrapper detail-file">
                    <input
                        type="file"
                        id="schema_data"
                        placeholder="Schema data"
                        @change="selectFile"
                        required
                        :class="{ 'loading': isLoading }"
                        :disabled="isLoading"
                        tabindex="0"
                        accept=".json, .txt"
                    />
                </div>
            </div>
            <div class="detail-group">
                <label>Preview</label>
                <div class="detail-wrapper">
                    <textarea
                        type="file"
                        id="schema_data_preview"
                        placeholder="Schema data"
                        v-model="schema.schemaData"
                        :class="{ 'loading': isLoading }"
                        disabled
                        readonly
                        :tabindex="update_registry ? -1 : 0"
                        rows="10"
                        cols="50"
                    />
                </div>
            </div>
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
import type { DetailsProps, Schema } from '~/assets/types/types';
import SingleInput from '../form-components/SingleInput.vue';
import { useAuthStore } from '~/assets/scripts/pinia';

const update_registry: Ref<boolean> = ref(false);
const url: Ref<string> = ref('');
const schema: Ref<Schema> = ref({});
const isLoading: Ref<boolean> = ref(false);
const props = defineProps<DetailsProps>();

const file: Ref<any> = ref();
const fileData: Ref<string> = ref('');

const route = useRoute();
const router = useRouter();
const token = useAuthStore().access_token;

watch(
    () => [props.url, props.registry],
    async ([props_url, props_registry]) => {
        url.value = props_url as string;
        if(props_registry == undefined) return;
        schema.value = props_registry as Schema;
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
        console.table(schema.value)
        isLoading.value = true;
        emit('saving-details');
        makeCursorWait();
        if(!url.value) throw 'Empty URL';
        if(!checkValidAttributes(schema.value)) throw 'The inserted values are not valid';
        let method: string;
        if (update_registry.value) method = 'PUT';
        else method = 'POST';
        const target_url = update_registry.value ? url.value + '/' + schema.value.id : url.value;
        const response = await apiRequest(
            target_url,
            method,
            schema.value,
            {
                'Authorization': `Bearer ${token?.access_token}`
            }
        );
        window.alert('Schema saved successfully');
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
        if(!checkValidAttributes(schema.value)) throw 'The inserted values are not valid';
        let method: string;
        if (update_registry.value) method = 'PUT';
        else method = 'POST';
        const target_url = update_registry.value ? url.value + '/' + schema.value.id : url.value;
        const response = await apiRequest(
            target_url,
            method,
            schema.value,
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
        emit('details-saved');
    }
}

const selectFile = async (f: any): Promise<any> => {
    file.value = f.target.files[0]
    fileData.value = await file.value.text()
    schema.value.schemaData = fileData.value;
}

const emit = defineEmits<{
    (event: 'close-details'): void;
    (event: 'saving-details'): void;
    (event: 'details-saved'): void;
}>();
</script>