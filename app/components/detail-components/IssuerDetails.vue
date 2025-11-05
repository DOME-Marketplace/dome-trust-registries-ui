<template>
    <div class="detail-container">
        <form class="detail-form">
            <single-input
                label="DID"
                id="issuer_did"
                placeholder="DID"
                v-model="issuer.did"
                required
                :disabled="update_registry"
                :tabindex="update_registry ? -1 : 0"
                :loading="isLoading"
            />
            <div class="detail-group">
                <label>Attributes</label>
                <div v-for="(attribute, i) in attributes" :key="i" class="attr-group listed-detail">
                    <div class="attr-header">
                        <p class="attr-title">Attribute #{{ i + 1 }}</p>
                        <button
                            type="button"
                            class="detail-button attr-button"
                            :class="{ 'loading': isLoading }"
                            :disabled="isLoading"
                            @click="removeAttribute(i)"
                        >
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                    <single-input
                        label="Hash"
                        v-model="attribute.hash"
                        :id="'attr_hash_' + i"
                        placeholder="Hash"
                        :loading="isLoading"
                        :disabled="isLoading"
                    />
                    <single-input
                        label="Issuer type"
                        v-model="attribute.issuerType"
                        :id="'attr_type_' + i"
                        placeholder="Type"
                        :loading="isLoading"
                        :disabled="isLoading"
                    />
                    <single-input
                        label="Credential type"
                        v-model="attribute.body!.credentialsType"
                        :id="'attr_credentials_' + i"
                        placeholder="Type"
                        :loading="isLoading"
                        :disabled="isLoading"
                    />
                    <div class="detail-column">
                        <single-input
                            label="Valid from"
                            v-model="attribute.body!.validFor!.from"
                            type="date"
                            :id="'attr_valid_from_' + i"
                            :loading="isLoading"
                            :disabled="isLoading"
                        />
                        <single-input
                            label="Valid to"
                            v-model="attribute.body!.validFor!.to"
                            type="date"
                            :id="'attr_valid_to_' + i"
                            :loading="isLoading"
                            :disabled="isLoading"
                        />
                    </div>
                    <label>Claims</label>
                    <div 
                        v-for="(claim, j) in attribute.body!.claims"
                        class="attr-group listed-detail"
                        :key="j"
                    >
                        <div class="attr-header">
                            <p class="attr-title">Claim #{{ j + 1 }}</p>
                            <button
                                type="button"
                                class="detail-button attr-button"
                                :class="{ 'loading': isLoading }"
                                :disabled="isLoading"
                                @click="removeClaim(j, attribute)"
                            >
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                        <single-input
                            label="Name"
                            placeholder="Name"
                            v-model="claim.name"
                            :id="'attr_claim_' + i + '_' + j + '_name'"
                            :loading="isLoading"
                            :disabled="isLoading"
                        />
                        <label>Allowed values</label>
                        <div v-for="(value,k) in claim.allowedValues" class="listed-detail-column">
                            <single-input
                                label=""
                                placeholder="Value"
                                v-model="value.value"
                                :loading="isLoading"
                                :disabled="isLoading"
                            />
                            <single-input
                                label=""
                                placeholder="Description"
                                v-model="value.description"
                                :loading="isLoading"
                                :disabled="isLoading"
                            />
                            <div class="detail-wrapper">
                                <button
                                    type="button"
                                    class="detail-button"
                                    :class="{ 'loading': isLoading }"
                                    :disabled="isLoading"
                                    @click="removeAllowedValue(k, claim)"
                                >
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                        <div class="detail-wrapper">
                            <button
                                type="button"
                                class="detail-button"
                                :class="{ 'loading': isLoading }"
                                :disabled="isLoading"
                                @click="addAllowedValue(claim)"
                            >
                                <span class="material-icons">add_circle</span>
                                &nbsp;&nbsp;
                                Add value
                            </button>
                        </div>
                    </div>
                    <div class="detail-wrapper">
                        <button
                            type="button"
                            class="detail-button"
                            :class="{ 'loading': isLoading }"
                            :disabled="isLoading"
                            @click="addClaim(attribute)"
                        >
                            <span class="material-icons">add_circle</span>
                            &nbsp;&nbsp;
                            Add claim
                        </button>
                    </div>
                </div>
                <div class="detail-wrapper">
                    <button
                        type="button"
                        class="detail-button"
                        :class="{ 'loading': isLoading }"
                        :disabled="isLoading"
                        @click="addAttribute"
                    >
                        <span class="material-icons">add_circle</span>
                        &nbsp;&nbsp;
                        Add attribute
                    </button>
                </div>
            </div>
        </form>
        <div class="detail-button-group">
            <button class="detail-button" :class="{ 'loading': isLoading }" v-on:click="saveRegistry">
                <span class="material-symbols-outlined">save_as</span>&nbsp;&nbsp;Save
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { apiRequest, checkValidAttributes, formatStringToDate, formatStringToISO, makeCursorWait, removeItemAt, stopCursorWaiting, trimArray } from '~/assets/scripts/utils';
import type { LEARCredentialIssuer, DetailsProps, IssuerAttributes, AttributeBody, AttributeClaim, ClaimAllowedValue } from '~/assets/types/types';
import SingleInput from '../form-components/SingleInput.vue';

const route = useRoute();
const router = useRouter();

const props = defineProps<DetailsProps>();

const issuer: Ref<LEARCredentialIssuer> = ref({});
const update_registry: Ref<boolean> = ref(false);
const url: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false)


onMounted(() => {
    console.log('LEAR CREDENTIAL ISSUER')
    console.log(issuer.value)
    const d = issuer.value.attributes?.at(0)?.body?.validFor?.from
    console.log(d)
    console.log(formatStringToDate(d))
    console.log(formatStringToISO(d))
    console.log(update_registry.value)
});


const attributes = computed<IssuerAttributes[]>({
    get() {
        return issuer.value.attributes ?? [];
    },
    set (value: IssuerAttributes[]) {
        issuer.value.attributes = value;
    }
});


const saveRegistry = async (): Promise<void> => {
    if (isLoading.value) return
    try{
        isLoading.value = true
        emit('saving-details')
        makeCursorWait()
        if (!url.value) throw 'Empty URL'
        if (!checkValidAttributes(issuer.value)) throw 'The inserted values are not valid'
        let method: string
        if (update_registry.value) method = 'PUT'
        else method = 'POST'
        const target_url = update_registry.value ? url.value + '/' + issuer.value.did : url.value

        attributes.value = attributes.value.map((attr) => {
            const from = attr.body?.validFor?.from
            if (from) attr.body!.validFor!.from = formatStringToISO(from)
            const to = attr.body?.validFor?.to
            if (to) attr.body!.validFor!.to = formatStringToISO(to)
            return attr
        })

        issuer.value.attributes = attributes.value

        const response = await apiRequest(
            target_url,
            method,
            issuer.value
        )

        window.alert('Issuer saved successfully')
        emit('close-details')
    } catch (error) {
        window.alert(error)
    } finally {
        isLoading.value = false;
        stopCursorWaiting();
        emit('details-saved')
    }
};

const emit = defineEmits<{
    (event: 'close-details'): void;
    (event: 'saving-details'): void;
    (event: 'details-saved'): void;
}>();


const addAttribute = (): void => {
    if(isLoading.value) return;
    const newAttribute: IssuerAttributes = {
        body: {
            credentialsType: '',
            validFor: {
                to: '',
                from: ''
            },
            claims: []
        },
    }
    attributes.value = [...attributes.value, newAttribute];
};

const removeAttribute = (index: number): void => {
    if(isLoading.value) return;
    attributes.value = removeItemAt(index, attributes.value);
};

const addClaim = (attr: IssuerAttributes): void => {
    if (isLoading.value) return;
    const newClaim: AttributeClaim = {}
    if (!attr.body) attr.body = {}
    if (!attr.body.claims) attr.body.claims = []
    attr.body.claims = [...attr.body.claims, newClaim]
}

const removeClaim = (index: number, attr: IssuerAttributes): void => {
    if (isLoading.value) return
    if (!attr.body?.claims) return
    attr.body.claims = removeItemAt(index, attr.body.claims)
}

const addAllowedValue = (claim: AttributeClaim): void => {
    if (isLoading.value) return
    const newAllowedValue: ClaimAllowedValue = {}
    if (!claim.allowedValues) claim.allowedValues = []
    claim.allowedValues = [...claim.allowedValues, newAllowedValue]
}

const removeAllowedValue = (index: number, claim: AttributeClaim): void => {
    if (isLoading.value) return
    if (!claim.allowedValues) return
    claim.allowedValues = removeItemAt(index, claim.allowedValues)
}


watch(
    () => [props.url, props.registry, route.query.id],
    async ([props_url, props_registry, query_id]) => {
        url.value = props_url as string;
        update_registry.value = !!query_id;
        if(!props_registry) return;
        issuer.value = props_registry as LEARCredentialIssuer;
        issuer.value.attributes?.forEach((attr) => {
            const from = attr.body?.validFor?.from
            const to = attr.body?.validFor?.to
            if(from) attr.body!.validFor!.from = formatStringToDate(from)
            if(to) attr.body!.validFor!.to = formatStringToDate(to)
        });
    },
    { immediate: true }
);
</script>

<style scoped>
.attr-group{
    border: 2px solid var(--dome-blue-light);
    border-radius: 15px;
    padding: 1vh 2vw;
}

.attr-header{
    display: flex;
    justify-content: space-around;
}

.attr-title{
    font-weight: bold;
    color: var(--dome-blue-light);
}

.attr-button{
    padding: 1vh .75vw !important;
}

.detail-column{
    display: flex;
    gap: 1vw;
}
</style>