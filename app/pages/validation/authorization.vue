<template>
    Validating authorization response...
</template> 

<script setup lang="ts">
import { useAlertStore, useAuthStore } from '~/assets/scripts/pinia';
import type { TokenRequest } from '~/assets/types/types';


const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const alertStore = useAlertStore();

onMounted(async () => {
    try{
        route.query.code = '1232'; // Remove this line when a real verifier is used!!
        const storedState = authStore.pkce?.state;
        const receivedState = route.query.state;

        if(!route.query.state || !route.query.code){
            throw new Error('Authorization response is empty!');
        }

        if(storedState !== receivedState){
            throw new Error('Authorization state mismatch!');
        }

        authStore.auth_code = route.query.code?.toString();

        // Don't need the token yet
        // const request: TokenRequest = {
        //     grant_type: 'authorization_code',
        //     client_id: authStore.pkce?.client_id,
        //     code_verifier: authStore.code_verifier,
        //     code: route.query.code?.toString(),
        //     redirect_uri: `${window.location.origin}/validation/token`
        // };

        // authStore.token = request;
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