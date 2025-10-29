<template>
  <div class="login-container">
    <div class="login-box">
      
        <a id="login-dome-website" href="https://dome-marketplace.eu/dashboard" target="_blank"><img src="@/assets/images/dome_logo_favicon.png" style="width: 35%;"/></a>
        
        <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
            <label>Username</label>
            <div class="input-wrapper">
            <input 
                type="text" 
                id="username" 
                v-model="username" 
                placeholder="Insert your username"
                required
            >
            </div>
        </div>
        
        <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
            <input 
                type="password" 
                id="password" 
                v-model="password" 
                placeholder="Insert your password"
                required
            >
            </div>
        </div>
        
        <button type="submit" class="login-button" :class="{ 'loading': isLoading }">
            <span v-if="!isLoading">Log in</span>
            <span v-else>Loading...</span>
        </button>
        </form>
        
        <div class="login-info" v-if="loginMessage">
        <p :class="loginMessageType">{{ loginMessage }}</p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sleep } from '~/assets/scripts/utils';
import { useRouter } from 'vue-router';

const username: Ref<string> = ref('')
const password: Ref<string> = ref('')
const isLoading: Ref<boolean> = ref(false)
const loginMessage: Ref<string> = ref('')
const loginMessageType: Ref<string> = ref('')

const router = useRouter();

const handleLogin = async () => {
  // Reset messages
  loginMessage.value = ''
  loginMessageType.value = ''
  
  // Validate inputs
  if (!username.value || !password.value) {
    return
  }
  
  // Set loading state
  isLoading.value = true
  
  // Simulate API call
  try {
    // Mocked login - simulate network delay
    await sleep(2000);
    
    router.push('/trust-registry');
    
  } catch (error) {
    loginMessage.value = error as string
    loginMessageType.value = 'error'
  } finally {
    isLoading.value = false
    
    // Clear message after 3 seconds
    setTimeout(() => {
      loginMessage.value = ''
    }, 3000)
  }
}
</script>

<style scoped>


/* Login Container */
.login-container {
    width: 100%;
    max-width: 450px;
}

/* Login Box - Neumorphic Card */
.login-box {
    background: var(--dome-blue-light);
    border-radius: 30px;
    padding: 50px 40px;
    box-shadow: 
        inset 10px 10px 10px var(--dome-shadow-dark),
        inset -10px -10px 10px var(--dome-shadow-light);
    text-align: center;
}


/* Form */
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

/* Login Button */
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

.login-button.loading {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Login Info Messages */
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
    color: #EF4444;
    box-shadow: 
        inset 3px 3px 6px #c4c4c4,
        inset -3px -3px 6px #ffffff;
}

#login-dome-website img{
    box-shadow: 
        5px 5px 10px var(--dome-shadow-dark),
        -5px -5px 10px var(--dome-shadow-light);
    border-radius: 50%;
    padding: 10px;
    transition: all 0.3s ease;
}

#login-dome-website img:hover{
    box-shadow: 
        3px 3px 8px var(--dome-shadow-dark),
        -3px -3px 8px var(--dome-shadow-light);
}

#login-dome-website img:active{
    box-shadow: 
        inset 5px 5px 10px var(--dome-shadow-dark),
        inset -5px -5px 10px var(--dome-shadow-light);
    transform: translateY(2px);
}

</style>