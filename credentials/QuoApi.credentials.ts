import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class QuoApi implements ICredentialType {
	name = 'quoApi';
	displayName = 'Quo API';
	documentationUrl = 'https://www.quo.com/docs/mdx/api-reference/introduction';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Quo API key. Generate one in your Quo workspace settings.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.openphone.com/v1',
			url: '/phone-numbers',
			method: 'GET',
		},
	};
}
