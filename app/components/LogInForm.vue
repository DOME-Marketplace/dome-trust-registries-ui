<template>
  <div class="login-container">
    <div class="login-box">
        <a id="login-dome-website" href="https://dome-marketplace.eu/dashboard" target="_blank">
            <img src="@/assets/images/dome_logo_favicon.png" style="width: 35%;"/>
        </a>
        <div class="input-group">
            <button class="login-button" :class="{ 'loading': isLoading }" @click="handleLogin">
                <span v-if="!isLoading">Log in</span>
                <span v-else>Loading...</span>
            </button>
        </div>
        <div class="input-group">
            <button class="login-button" :class="{ 'loading': isLoading }" @click="handleRegistration">
                <span v-if="!isLoading">Register</span>
                <span v-else>Loading...</span>
            </button>
        </div>
        <div class="login-info" v-if="loginMessage">
        <p :class="loginMessageType">{{ loginMessage }}</p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { makeCursorWait, sleep, stopCursorWaiting } from '~/assets/scripts/utils';
import { useRouter } from 'vue-router';
import { useAlertStore, useAuthStore } from '~/assets/scripts/pinia';
import { generatePkcePair, generateState, sendAuthRequest } from '~/assets/scripts/auth';
import type { PKCERequest } from '~/assets/types/types';

const isLoading: Ref<boolean> = ref(false)
const loginMessage: Ref<string> = ref('')
const loginMessageType: Ref<string> = ref('')

const router = useRouter();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const config = useRuntimeConfig().public;


onMounted(() => {
    if(alertStore.message){
        loginMessage.value = alertStore.message;
        loginMessageType.value = 'error'
    }
    setTimeout(() => {
        alertStore.clearMessage();
        loginMessage.value = '';
        loginMessageType.value = '';
        },
        5000
    );
});

const handleLogin = async () => {
  loginMessage.value = ''
  loginMessageType.value = ''
  isLoading.value = true
  makeCursorWait();
  try {
    const pkcePair = await generatePkcePair(Number(config.codeLength),config.codeAlgo as string);
    const state = generateState(Number(config.stateLength));
    console.info(`
        CLIENT ID: ${config.clientId}
        AUTH SERVER: ${config.authServer}
        TOKEN SERVER: ${config.tokenServer}
        CODE CHALLENGE: ${pkcePair.code_challenge}
        CODE VERIFIER: ${pkcePair.code_verifier}
        CHALLENGE METHOD: ${config.challengeMethod}
        CODE LENGTH: ${config.codeLength}
        STATE LENGTH: ${config.stateLength}
        STATE: ${state}
        REDIRECT URI: ${window.location.origin}/validation/authorization
    `)
    const request: PKCERequest = {
        client_id: config.clientId as string,
        code_challenge: pkcePair.code_challenge,
        response_type: 'code',
        code_challenge_method: config.challengeMethod as string,
        state: state,
        redirect_uri: `${window.location.origin}/validation/authorization`
    };
    // Temporarily store
    authStore.pkce = request;
    authStore.code_verifier = pkcePair.code_verifier;
    authStore.code_challenge = pkcePair.code_challenge;
    await sendAuthRequest(
        config.authServer as string,
        request
    );
  } catch (error) {
    loginMessage.value = error as string
    loginMessageType.value = 'error'
    console.error(error)
  } finally {
    isLoading.value = false
    stopCursorWaiting();
    setTimeout(() => {
      loginMessage.value = ''
    }, 3000)
  }
}

const handleRegistration = () => {
    window.open('https://dome-marketplace.github.io/onboarding/');
}
</script>

<style scoped>
.login-container {
    width: 100%;
    max-width: 450px;
}

.login-box {
    background: var(--dome-blue-light);
    border-radius: 30px;
    padding: 50px 40px;
    box-shadow: 
        inset 10px 10px 10px var(--dome-shadow-dark),
        inset -10px -10px 10px var(--dome-shadow-light);
    text-align: center;
}

.login-form {
    margin-top: 30px;
}

.input-group {
    margin-bottom: 25px;
    text-align: left;
}

.input-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--dome-blue);
    margin-bottom: 10px;
}

.input-wrapper input{
    border-radius: 15px;
    padding: 14px 18px;
    width: 90%;
    border: none;
    font-size: 15px;
    font-weight: bold;
    color: var(--dome-blue);
    outline: none;
    background: var(--dome-blue-light);
    box-shadow: 
        -5px -5px 10px var(--dome-shadow-light),
         5px 5px 10px var(--dome-shadow-dark);
    transition: all 0.3s ease;
}

.input-wrapper input::placeholder {
    color: #9CA3AF;
}

.input-wrapper input:focus {
    box-shadow: 
        inset -5px -5px 10px var(--dome-shadow-light),
        inset 5px 5px 10px var(--dome-shadow-dark);
} 

.input-wrapper input:hover:not(:focus){
    box-shadow: 
        -3px -3px 8px var(--dome-shadow-light),
        3px 3px 8px var(--dome-shadow-dark);
    transform: translateY(1px);
}

.login-button {
    width: 100%;
    padding: 16px;
    margin-top: 10px;
    border: none;
    border-radius: 15px;
    background: var(--dome-blue-light);
    color: var(--dome-blue);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
        8px 8px 16px var(--dome-shadow-dark),
        -8px -8px 16px var(--dome-shadow-light);
    letter-spacing: 0.5px;
    outline: none;
}

.login-button:hover {
    box-shadow: 
        4px 4px 8px var(--dome-shadow-dark),
        -4px -4px 8px var(--dome-shadow-light);
    transform: translateY(1px);
}

.login-button:active {
    box-shadow: 
        inset 5px 5px 10px var(--dome-shadow-dark),
        inset -5px -5px 10px var(--dome-shadow-light);
    transform: translateY(2px);
}

.login-button:focus {
    box-shadow: 
        4px 4px 8px var(--dome-shadow-dark),
        -4px -4px 8px var(--dome-shadow-light);
    transform: translateY(1px);
    background-color: var(--dome-focused-blue);
}

.login-info {
    margin-top: 20px;
}

.login-info p {
    padding: 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
}

.login-info p.success {
    background: #E8E8E8;
    color: #10B981;
    box-shadow: 
        inset 3px 3px 6px #c4c4c4,
        inset -3px -3px 6px #ffffff;
}

.login-info p.error {
    background: #E8E8E8;
    color: var(--error-color);
    box-shadow: 
        inset 3px 3px 6px #c4c4c4,
        inset -3px -3px 6px #ffffff;
}

#login-dome-website{
    outline: none;
}

#login-dome-website img{
    box-shadow: 
        6px 6px 10px var(--dome-shadow-dark),
        -6px -6px 10px var(--dome-shadow-light);
    border-radius: 50%;
    padding: 10px;
    transition: all 0.3s ease;
}

#login-dome-website img:hover{
    box-shadow: 
        3px 3px 5px var(--dome-shadow-dark),
        -3px -3px 5px var(--dome-shadow-light);
}

#login-dome-website img:active{
    box-shadow: 
        inset 5px 5px 10px var(--dome-shadow-dark),
        inset -5px -5px 10px var(--dome-shadow-light);
    transform: translateY(2px);
}

#login-dome-website:focus img{
    box-shadow: 
        3px 3px 5px var(--dome-shadow-dark),
        -3px -3px 5px var(--dome-shadow-light);
    background-color: var(--dome-focused-blue);
}

</style>