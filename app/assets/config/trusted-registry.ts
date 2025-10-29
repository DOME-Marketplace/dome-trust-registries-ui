export const trustedRegistry = {
    'host': 'http://localhost:8080',
    'main-uri': '/v4',
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