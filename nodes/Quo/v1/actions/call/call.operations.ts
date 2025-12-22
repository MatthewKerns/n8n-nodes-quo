import type { INodeProperties } from 'n8n-workflow';

export const callOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['call'],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'get',
			description: 'Get a call by ID',
			action: 'Get a call',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get multiple calls',
			action: 'Get many calls',
		},
		{
			name: 'Get Recording',
			value: 'getRecording',
			description: 'Get the recording for a call',
			action: 'Get a call recording',
		},
		{
			name: 'Get Summary',
			value: 'getSummary',
			description: 'Get the AI summary for a call',
			action: 'Get a call summary',
		},
		{
			name: 'Get Transcription',
			value: 'getTranscription',
			description: 'Get the transcription for a call',
			action: 'Get a call transcription',
		},
	],
	default: 'get',
};

export const callFields: INodeProperties[] = [
	// ----------------------------------
	//         call:get / getRecording / getTranscription / getSummary
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['get', 'getRecording', 'getTranscription', 'getSummary'],
			},
		},
		description: 'The ID of the call',
	},

	// ----------------------------------
	//         call:getMany
	// ----------------------------------
	{
		displayName: 'Phone Number ID',
		name: 'phoneNumberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['getMany'],
			},
		},
		description: 'The ID of the Quo phone number to filter by',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['call'],
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
				resource: ['call'],
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
				resource: ['call'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Participant Phone Number',
				name: 'participantPhoneNumber',
				type: 'string',
				default: '',
				description: 'Filter calls by participant phone number (E.164 format)',
			},
		],
	},
];
