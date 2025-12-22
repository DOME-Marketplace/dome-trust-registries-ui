# DOME MARKETPLACE TRUST REGISTRIES WEBSITE
This UI requires the following:
 - The Trust Registry API (see [DOME Trust Registry](https://github.com/DigitelTS/dome-trust-registry))
 - The Trust Registry database server (see [Docker Database](https://github.com/DigitelTS/dome-trust-registry/tree/docker-database))
 - A Blockchain in which the Trust Participant DID smart-contract is deployed (see [DID Contract List](https://github.com/DigitelTS/dome-trust-registry/tree/did-contract-list))

## Table of Contents
 1. [Basic Flow](#1-basic-flow)
 2. [Trust Registries](#2-trust-registries)
 3. [Local Deployment](#3-local-deployment)

## 1. Basic Flow

### 1.1. Login
The DOME Operator lands in the `login` page, where two options are available.
![](/images/dome_login.png)

#### Registering
This button redirects the DOME Operator to the [DOME Onboarding page](https://onboarding.dome-marketplace.eu/).
![](/images/dome_onboarding.png)

#### Logging In 
Already registered DOME Operators will be redirected to the verifier so they can log in through their EUDI Wallet or DOME Digital Wallet.
![](/images/dome_verifier.png)

### 1.2. Trust Registry Operations
After a successful login, the DOME Operator will be redirected to the `trust-registry` page. Here, several tabs can be found in the left side of the screen, one per each available Trust Registry. Clicking on each tab, the list of current entries from each Trust Registry kind will be displayed. Selecting one entry will show its data, allowing the DOME Operator to modify it.

Additionally, the DOME Operator can add new entries by pressing the `Add registry` button. In this situation, the DOME Operator will have to fill a form with the specific fields defined for each Trust Registry type.

## 2. Trust Registries
The current Trust Registry types are described in this section.

### 2.1. Trusted Access Node
A Trusted Access Node is a trusted node in the DOME ecosystem which holds a portion of the DOME's decentralized data.

| Field | Description |
| --- | --- |
| `DLT Address` | The Ethereum Address of the organization's Access Node. |
| `Name` | The name of the organization. |

### 2.2. Trusted LEAR Credential Issuers
A Trusted LEAR Credential Issuer is a trusted public entity which can issue Verifiable Credentials belonging to a given domain or of a given type.

| Field | Description |
| --- | --- |
| `OID` | The Organization ID of the Trusted LEAR Credential Issuer. |
| `Attributes` | List of objects defining the issuer's attributes. |
| `Has Attributes` | This field must be set to `true`, since Trusted LEAR Credential Issuers must have attributes. |

The issuer's attributes must contain the following fields:
 - `Hash`
 - `Issuer Type`
 - `Body`
    - `Valid For`: Time range in which the credential is valid.
        - `From`: Start of validity.
        - `To`: End of validity.
    - `Credential's Type`
    - `Claims`: List of objects representing the issuer's claims.
        - `Name`: The name of the claim.
        - `Allowed Values`: List of objects representing allowed claims.
            - `Value`: The allowed value.
            - `Description`: A description of the allowed value.

### 2.3. Trusted Participants
A Trusted Participant is a legal entity onboarded in DOME. 

| Field | Description |
| --- | --- |
| `OID` | The Organization ID of the Trusted Participant. |
| `Attributes` | This field must be empty. |
| `Has Attributes` | This field must be set to `false`, since Trusted Participants can't have attributes. |

### 2.4. Trusted Schemas
A Trusted Schema is an object describing a well-known credential schema.

| Field | Description |
| --- | --- |
| `ID` | An identifier for the Trusted Schema. |
| `Schema Data` | The JSON schema as a text string. |

### 2.5. Trusted Services
A Trusted Service is a verified and authorized service within the DOME ecosystem.

| Field | Description |
| --- | --- |
| `Client ID` | Should be a `did:key` or a unique identifier for your client. Using a `did:key` allows the verifier to obtain your public keys for signature verification without needing a separate JWKS endpoint. |
| `URL` | The base URL of your service or application. |
| `Redirect URIs` | Must include all the URLs where you expect to receive authentication responses. These should be HTTPS URLs to ensure secure communication. |
| `Scopes` | Currently `openid_learcredential` is allowed. This scope allows your service to request the necessary credentials. |
| `Client Authentication Methods` | --- |
| `Authorization Grant Types` | List of supported grant types |
| `Post-Logout Redirect URIs` | Include the URLs where users should be redirected after they log out from your service. |
| `Require Authorization Consent` | Indicates whether explicit user consent is required. |
| `Require Proof Key` | Indicates whether Proof Key for Code Exchange (PKCE) is required. |
| `JWT Set URL` | URL where your public keys can be fetched. This field is only needed if the Client ID is not a `did:key` identifier |
| `Token Endpoint Authentication Signing Algorithm` | Currently the only supported algorithm is `ES256` |
 
## 3. Local Deployment

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
