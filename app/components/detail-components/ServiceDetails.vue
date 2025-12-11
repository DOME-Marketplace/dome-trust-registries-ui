<template>
    <div class="detail-container-big">
        <form class="detail-form">
            <SingleInput 
                label="Client ID"
                id="client_id"
                placeholder="ID"
                v-model="service.client_id"
                required
                :disabled="update_registry || isLoading"
                :loading="isLoading"
                :tabindex="update_registry ? -1 : 0"
            />
            <SingleInput
                label="Base URL"
                id="base_url"
                placeholder="URL"
                v-model="service.url"
                :disabled="update_registry || isLoading"
                :loading="isLoading"
                :tabindex="update_registry ? -1 : 0"
            />
            <div class="detail-group">
                <label>Authorization Consent</label>
                <label class="switch">
                    <input
                        type="checkbox"
                        id="require_auth_consent"
                        v-model="service.requireAuthorizationConsent"
                        :disabled="isLoading"
                    />
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="detail-group">
                <label>Proof Key</label>
                <label class="switch">
                    <input
                        type="checkbox"
                        id="require_proof_key"
                        v-model="service.requireProofKey"
                        :disabled="isLoading"
                    />
                    <span class="slider round"></span>
                </label>
            </div>
            <SingleInput 
                label="JWK URL"
                id="jwk_url"
                placeholder="URL"
                v-model="service.jwkSetUrl"
                required
                :disabled="isLoading"
                :loading="isLoading"
            />
            <SingleInput 
                label="Token Endpoint Authentication Singing Algorithm"
                id="token_signing_alg"
                placeholder="Algorithm"
                v-model="service.tokenEndpointAuthenticationSigningAlgorithm"
                required
                :disabled="isLoading"
                :loading="isLoading"
            />
            <ListInput
                v-model="uris"
                label="Redirect URIs"
                placeholder="URI"
                add-button-text="Add URI"
                :disabled="isLoading"
                id-prefix="redirect_uris"
            />
            <ListInput
                v-model="scopes"
                label="Scopes"
                placeholder="Scope"
                add-button-text="Add Scope"
                :disabled="isLoading"
                id-prefix="scopes"
            />
            <ListInput
                v-model="authMethods"
                label="Authentication Methods"
                placeholder="Auth method"
                add-button-text="Add Auth method"
                :disabled="isLoading"
                id-prefix="auth_method"
            />
            <ListInput
                v-model="postUris"
                label="Post-Logout Redirect URIs"
                placeholder="URI"
                add-button-text="Add URI"
                :disabled="isLoading"
                id-prefix="post_uris"
            />
            <ListInput
                v-model="grantTypes"
                label="Authorization Grant Types"
                placeholder="Type"
                add-button-text="Add type"
                :disabled="isLoading"
                id-prefix="grant_types"
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
import { apiRequest, checkValidAttributes, makeCursorWait, pageBack, stopCursorWaiting, trimArray } from '~/assets/scripts/utils';
import type { DetailsProps, Services } from '~/assets/types/types';
import ListInput from '../form-components/ListInput.vue';
import SingleInput from '../form-components/SingleInput.vue';

const update_registry: Ref<boolean> = ref(false);
const url: Ref<string> = ref('');
const service: Ref<Services> = ref({});
const isLoading: Ref<boolean> = ref(false);
const props = defineProps<DetailsProps>();
const route = useRoute();
const router = useRouter();

const getUris = (): string[] => {
    const raw = (service.value.redirectUris ?? []) as (string | string[] | null | undefined);
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim().length) return [raw];
    return [];
};
const getScopes = (): string[] => {
    const raw = (service.value.scopes ?? []) as (string | string[] | null | undefined);
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim().length) return [raw];
    return [];
};
const getAuthMethods = (): string[] => {
    const raw = (service.value.clientAuthenticationMethods ?? []) as (string | string[] | null | undefined);
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim().length) return [raw];
    return [];
}
const getPostUris = (): string[] => {
    const raw = (service.value.postLogoutRedirectUris ?? []) as (string | string[] | null | undefined);
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim().length) return [raw];
    return [];
}
const getGrantTypes = (): string[] => {
    const raw = (service.value.authorizationGrantTypes ?? []) as (string | string[] | null | undefined);
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim().length) return [raw];
    return [];
}


const uris = computed<string[]>({
    get() {
        return getUris();
    },
    set(value: string[]) {
        service.value.redirectUris = value;
    },
});
const scopes = computed<string[]>({
    get() {
        return getScopes();
    },
    set(value: string[]) {
        service.value.scopes = value;
    },
});
const authMethods = computed<string[]>({
    get() {
        return getAuthMethods();
    },
    set(value: string[]) {
        service.value.clientAuthenticationMethods = value;
    },
});
const postUris = computed<string[]>({
    get() {
        return getPostUris();
    },
    set(value: string[]) {
        service.value.postLogoutRedirectUris = value;
    },
});
const grantTypes = computed<string[]>({
    get() {
        return getGrantTypes();
    },
    set(value: string[]) {
        service.value.authorizationGrantTypes = value;
    },
});


watch(
    () => [props.url, props.registry],
    async ([props_url, props_registry]) => {
        url.value = props_url as string;
        if (props_registry == undefined) return;
        service.value = props_registry as Services;

        service.value.redirectUris = getUris();
        service.value.scopes = getScopes();
        service.value.clientAuthenticationMethods = getAuthMethods();
        service.value.postLogoutRedirectUris = getPostUris();
        service.value.authorizationGrantTypes = getGrantTypes();

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
        if(!checkValidAttributes(service.value)) throw 'The inserted values are not valid';
        let method: string;
        if (update_registry.value) method = 'PUT';
        else method = 'POST';
        const target_url = update_registry.value ? url.value + '/' + service.value.client_id : url.value;

        service.value.redirectUris = trimArray(uris.value);
        service.value.scopes = trimArray(scopes.value);
        service.value.clientAuthenticationMethods = trimArray(authMethods.value);
        service.value.postLogoutRedirectUris = trimArray(postUris.value);
        service.value.authorizationGrantTypes = trimArray(grantTypes.value);

        const response = await apiRequest(
            target_url,
            method,
            service.value
        );
        window.alert('Service saved successfully');
        emit('close-details');
    } catch (error) {
        window.alert(error);
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
<style scoped>
.switch{
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input{
    opacity: 0;
    width: 0;
    height: 0;
}

.slider{
    position: absolute;
    inset: 0;
    border-radius: 34px;
    background: var(--dome-blue-light);
    transition: all .3s ease;
    cursor: pointer;
}

.slider::before{
    content: "";
    position: absolute;
    left: 4px;
    top: 4px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--dome-blue-light);
    box-shadow:
        inset 2.5px 2.5px 2.5px var(--dome-shadow-dark),
        inset -2.5px -2.5px 2.5px var(--dome-shadow-light);

    transition: all .3s ease;
}

.slider::after{
    content: "✓";
    position: absolute;
    top: 50%;
    left: 4px;
    width: 26px;
    height: 26px;
    transform: translate(0, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--dome-blue);
    opacity: 0;
    transition: all .3s ease;
}

.switch input:checked + .slider::before{
    transform: translateX(26px);
    background: var(--dome-blue-light);
    box-shadow:
        5px 5px 10px var(--dome-shadow-dark);
}

.switch input:checked + .slider::after{
    transform: translate(26px, -50%);
    opacity: 1;
}

.switch input:checked + .slider{
    background-color: var(--dome-focused-blue);
}

.switch input:focus + .slider{
    outline: 2px solid rgba(0,0,0,0.05);
    outline-offset: 2px;
}
.switch input:disabled + .slider{
    opacity: .6;
    cursor: not-allowed;
}
</style>