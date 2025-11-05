/*
IMPORTANT NOTE

For these types to work as the body for the
HTTP POST/PUT requests, their fields' names
MUST match the ones defined in the API
*/

/// Trusted Registry basic information ///
export type RegistryConfiguration = {
    id: string;
    label: string;
    uri: string;
}

/// Trusted Registry summary ///
export type RegistrySummary = {
    did: string;
    href: string;
}


/// Trusted Registry list pages ///
export type RegistryPages = {
    first?: URL,
    prev?: URL,
    next?: URL,
    last?: URL
}


/// Trusted Registry details component props ///
export type DetailsProps = {
    url: string;
    registry?: 
        AccessNode |
        LEARCredentialIssuer |
        Participant |
        Schema |
        Services; 
}

/// Trusted Access Nodes ///
export type AccessNode = {
    dlt_address?: string;
    name?: string;
}


/// Trusted LEAR Credential Issuers ///
export type AttributeValidity = {
    from?: string;
    to?: string;
}

export type AttributeBody = {
    credentialsType?: string;
    validFor?: AttributeValidity;
    claims?: AttributeClaim[];
}

export type ClaimAllowedValue = {
    value?: string;
    description?: string;
}

export type AttributeClaim = {
    name?: string;
    allowedValues?: ClaimAllowedValue[];
}

export type IssuerAttributes = {
    hash?: string;
    issuerType?: string;
    body?: AttributeBody;
}

export type LEARCredentialIssuer = {
    did?: string;
    attributes?: IssuerAttributes[];
    hasAttributes?: boolean;
}


/// Trusted Participants ///
export type Participant = {
    did?: string;
    attributes?: [];
    hasAttributes?: false;
}


/// Trusted Schemas ///
export type Schema = {
    id?: string;
    schemaData?: string;
}


/// Trusted Services ///
export type Services = {
    client_id?: string;
    redirectUris?: string[];
    scopes?: string[];
    clientAuthenticationMethods?: string[];
    requireAuthorizationConsent?: boolean;
    postLogoutRedirectUris?: string[];
    requireProofKey?: boolean;
    jwkSetUrl?: string;
    tokenEndpointAuthenticationSigningAlgorithm?: string;
    authorizationGrantTypes?: string[]
}
