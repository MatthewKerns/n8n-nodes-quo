import type { INodeProperties } from 'n8n-workflow';

export const phoneNumberOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['phoneNumber'],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'get',
			description: 'Get a phone number by ID',
			action: 'Get a phone number',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get all phone numbers in the workspace',
			action: 'Get many phone numbers',
		},
	],
	default: 'getMany',
};

export const phoneNumberFields: INodeProperties[] = [
	// ----------------------------------
	//         phoneNumber:get
	// ----------------------------------
	{
		displayName: 'Phone Number ID',
		name: 'phoneNumberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['get'],
			},
		},
		description: 'The ID of the phone number',
	},

	// ----------------------------------
	//         phoneNumber:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
