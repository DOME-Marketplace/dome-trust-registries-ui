import { defineStore } from "pinia";
import type { PKCERequest, TokenRequest } from "../types/types";

export const useAuthStore = defineStore(
    'auth',
    {
        state: () => {
            return {
                pkce: undefined as PKCERequest | undefined,
                token: undefined as TokenRequest | undefined,
                code_verifier: undefined as string | undefined,
                code_challenge: undefined as string | undefined,
                auth_code: undefined as string | undefined
            }
        },
        actions: {
            clearAuthData() {
                this.pkce = undefined;
                this.code_verifier = undefined;
                this.code_challenge = undefined;
            },
            clearValidationData() {
                this.token = undefined;
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