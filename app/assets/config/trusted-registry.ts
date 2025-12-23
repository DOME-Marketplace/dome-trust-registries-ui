export const trustedRegistry = () => {
    const config = useRuntimeConfig();
    return {
        host: config.public.apiHost as string,
        'main-uri': config.public.apiMainUri as string,
        'trusted-lists': [
            {
                'id': 'access-nodes',
                'label': 'Trusted Access Nodes', 
                'uri': '/accessNodes'
            },
            {
                'id': 'issuers',
                'label': 'Trusted LEAR Credential Issuers', 
                'uri': '/issuers'
            },
            {
                'id': 'participants',
                'label': 'Trusted Participants', 
                'uri': '/participants'
            },
            {
                'id': 'schemas',
                'label': 'Trusted Schemas', 
                'uri': '/schemas'
            },
            {
                'id': 'services',
                'label': 'Trusted Services', 
                'uri': '/services'
            }
        ]
    }
}