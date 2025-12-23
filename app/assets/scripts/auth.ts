/**
 * Reference: https://www.rfc-editor.org/rfc/rfc7636
 */

import { apiRequest } from "./utils";
import type { PKCERequest } from "../types/types";

/**
 * Generation of the code verifier - [RFC7636](https://www.rfc-editor.org/rfc/rfc7636)
 * 
 * Definition of code verifier: high-entropy cryptographic random STRING using the
 * unreserved characters [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~", with a
 * minimum length of 43 characters and a maximum length of 128 characters.
 */
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  // const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  // return Array.from(array, x => chars[x % chars.length]).join('');
  return btoa(String.fromCharCode(...array))
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '')
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => binary += String.fromCharCode(b));
  let base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Base64Url(input: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return base64UrlEncode(hashBuffer);
}

export async function generatePkcePair(length: number, algorithm: string) {
  const code_verifier = generateRandomString(length);
  // Code challenge is BASE64URL-ENCODE(SHA256(ASCII(code verifier)))
  const code_challenge = await sha256Base64Url(code_verifier, algorithm);
  return { code_verifier, code_challenge };
}

export function generateState(length: number): string{
  return generateRandomString(length);
}

/**
 * Authorization request - [RFC7636](https://www.rfc-editor.org/rfc/rfc7636) & [RFC6749](https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1)
 * 
 * Fields:
 *  - `response_type`: Must be "code"
 *  - `client_id`: The client identifier
 *  - `redirect_uri`: Where to redirect the user after the authentication
 *  - `scope`: The scope of the access request
 *  - `state`: Value to maintain state between the request and callback
 *  - `code_challenge`
 *  - `code_challenge_method`: "S256" or "plain"
 * 
 * @param verifier The URL of the Authentication Server
 * @param requestData The request that will be sent to the
 */
export async function sendAuthRequest(
    verifier: string,
    requestData: PKCERequest
): Promise<any>{
    const url = new URL(verifier);
    url.searchParams.set('client_id', requestData.client_id);
    url.searchParams.set('response_type', requestData.response_type);
    url.searchParams.set('code_challenge', requestData.code_challenge);
    if(requestData.code_challenge_method) url.searchParams.set('code_challenge_method', requestData.code_challenge_method);
    if(requestData.redirect_uri) url.searchParams.set('redirect_uri', requestData.redirect_uri);
    if(requestData.scope) url.searchParams.set('scope', requestData.scope);
    if(requestData.state) url.searchParams.set('state', requestData.state);
    /*
    return await apiRequest(url.toString(), 'GET');
    */
   window.location.replace(url.toString());
}