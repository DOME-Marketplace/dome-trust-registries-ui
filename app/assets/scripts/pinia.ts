import { defineStore } from "pinia";
import type { AccessToken, PKCERequest, TokenRequest } from "../types/types";

export const useAuthStore = defineStore(
    'auth',
    {
        state: () => {
            return {
                pkce: undefined as PKCERequest | undefined,
                code_verifier: undefined as string | undefined,
                code_challenge: undefined as string | undefined,
                auth_code: undefined as string | undefined,
                access_token: undefined as AccessToken | undefined
            }
        },
        actions: {
            clearAuthData() {
                this.pkce = undefined;
                this.code_verifier = undefined;
                this.code_challenge = undefined;
                this.auth_code = undefined;
            }
        },
        persist: {
            storage: piniaPluginPersistedstate.sessionStorage(),
            pick: ['pkce', 'code_verifier', 'code_challenge']
        }
    },
);

export const useAlertStore = defineStore(
    'alert',
    {
        state: () => {
            return {
                message: undefined as string | undefined
            }
        },
        actions: {
            clearMessage() {
                this.message = undefined;
            }
        }
    }
)