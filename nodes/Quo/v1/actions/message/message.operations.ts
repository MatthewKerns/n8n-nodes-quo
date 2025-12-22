import type { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['message'],
		},
	},
	options: [
		{
			name: 'Send',
			value: 'send',
			description: 'Send a text message',
			action: 'Send a text message',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a message by ID',
			action: 'Get a message',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get multiple messages',
			action: 'Get many messages',
		},
	],
	default: 'send',
};

export const messageFields: INodeProperties[] = [
	// ----------------------------------
	//         message:send
	// ----------------------------------
	{
		displayName: 'Phone Number ID',
		name: 'phoneNumberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send', 'getMany'],
			},
		},
		description: 'The ID of the Quo phone number to send from',
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		description: 'The phone number to send the message to (E.164 format, e.g., +15551234567)',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		description: 'The text content of the message',
	},

	// ----------------------------------
	//         message:get
	// ----------------------------------
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['get'],
			},
		},
		description: 'The ID of the message to retrieve',
	},

	// ----------------------------------
	//         message:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['message'],
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
				resource: ['message'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Participant Phone Number',
				name: 'participantPhoneNumber',
				type: 'string',
				default: '',
				description: 'Filter messages by participant phone number (E.164 format)',
			},
		],
	},
];
