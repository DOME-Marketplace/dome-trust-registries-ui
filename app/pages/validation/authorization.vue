<template>
    Validating authorization response...
</template> 

<script setup lang="ts">
import { useAlertStore, useAuthStore } from '~/assets/scripts/pinia';
import { apiRequest } from '~/assets/scripts/utils';
import type { TokenRequest, AccessToken } from '~/assets/types/types';


const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const config = useRuntimeConfig().public;

onMounted(async () => {
    try{
        const storedState = authStore.pkce?.state;
        const receivedState = route.query.state;

        if(!route.query.state || !route.query.code){
            throw new Error('Authorization response is empty!');
        }

        if(storedState !== receivedState){
            throw new Error('Authorization state mismatch!');
        }

        authStore.auth_code = route.query.code?.toString();

        const request: TokenRequest = {
            grant_type: 'authorization_code',
            client_id: authStore.pkce?.client_id,
            code_verifier: authStore.code_verifier,
            code: route.query.code?.toString(),
            redirect_uri: `${window.location.origin}${window.location.pathname}`
        };
        const token = await apiRequest<AccessToken>(
            config.tokenServer as string,
            'POST',
            request,
            {
                'Content-Type': 'application/json',
                'Content-Length': 311
            }
        )

        if(!token.access_token){
            throw new Error('Missing token!');
        }
        if(!token.id_token){
            throw new Error('Missing ID token');
        }
        authStore.access_token = token;
        authStore.clearAuthData();
        router.push('/trust-registry')
       }catch(error: unknown){
        if(error instanceof Error){
            alertStore.message = error.message;
            router.push('/login');
        }
       }
});
</script>