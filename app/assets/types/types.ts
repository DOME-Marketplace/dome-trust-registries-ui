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
    credentials_type?: string;
    valid_for?: AttributeValidity;
}

export type ClaimAllowedValue = {
    value?: string;
    description?: string;
}

export type AttributeClaim = {
    name?: string;
    allowed_values?: ClaimAllowedValue[];
}

export type IssuerAttributes = {
    hash?: string;
    issuer_type?: string;
    body?: AttributeBody;
    claims?: AttributeClaim[];
}

export type LEARCredentialIssuer = {
    did?: string;
    attributes?: IssuerAttributes[];
    has_attributes?: boolean;
}


/// Trusted Participants ///
export type Participant = {
    did?: string;
    attributes?: [];
    has_attributes?: false;
}


/// Trusted Schemas ///
export type Schema = {
    id?: string;
    schemaData?: string;
}


/// Trusted Services ///
export type Services = {
    client_id?: string;
    redirect_uris?: string[];
    scopes?: string[];
    client_authentication_methods?: string[];
    require_authorization_consent?: boolean;
    require_proof_key?: boolean;
    jwk_set_url?: string;
    token_endpoint_authentication_signing_algorithm?: string;
    authorization_grant_types?: string
}
