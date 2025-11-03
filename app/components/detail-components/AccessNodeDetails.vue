<template>
    <div class="detail-container">
        <form class="detail-form">
            <div class="detail-group">
                <label>DLT Address</label>
                <div class="detail-wrapper">
                    <input
                        type="text"
                        id="dlt_address"
                        placeholder="DLT Address"
                        v-model="accessNode.dlt_address"
                        required
                        :class="{ 'loading': update_registry }"
                        :tabindex="update_registry ? -1 : 0"
                    />
                </div>
            </div>
            <div class="detail-group">
                <label>Name</label>
                <div class="detail-wrapper">
                    <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        v-model="accessNode.name"
                        required
                    />
                </div>
            </div>
        </form>
        <div class="detail-button-group">
            <button class="detail-button" :class="{ 'loading': isLoading }" v-on:click="saveRegistry">
                <span class="material-symbols-outlined">save_as</span>&nbsp;&nbsp;Save
            </button>
            <!-- <button class="detail-button" style="color: var(--error-color)" :class="{ 'loading': isLoading }" v-on:click="deleteRegistry">
                <span class="material-symbols-outlined">delete_forever</span>&nbsp;&nbsp;Delete
            </button> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { apiRequest, checkValidAttributes, pageBack } from '~/assets/scripts/utils';
import type { AccessNode, DetailsProps } from '~/assets/types/types';

const update_registry: Ref<boolean> = ref(false);
const url: Ref<string> = ref('');
const accessNode: Ref<AccessNode> = ref({});
const isLoading: Ref<boolean> = ref(false);
const props = defineProps<DetailsProps>();
const route = useRoute();
const router = useRouter();

watch(
    () => [props.url, props.registry],
    async ([props_url, props_registry]) => {
        url.value = props_url as string;
        if(props_registry == undefined) return;
        accessNode.value = props_registry as AccessNode;
        console.log(route.query.id);
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
    try{
        isLoading.value = true;
        if(!url.value) throw 'Empty URL';
        if(!checkValidAttributes(accessNode.value)) throw 'The inserted values are not valid';
        let method: string;
        if (update_registry.value) method = 'PUT';
        else method = 'POST';
        const target_url = update_registry.value ? url.value + '/' + accessNode.value.dlt_address : url.value;
        const response = await apiRequest(
            target_url,
            method,
            accessNode.value
        );
        console.log(response);
        window.alert('Access Node saved successfully');
        emit('close-details');
    } catch (error) {
        window.alert(error);
    } finally {
        isLoading.value = false;
    }
}

const emit = defineEmits<{
    (event: 'close-details'): void;
}>();
</script>