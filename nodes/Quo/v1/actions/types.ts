import type { INodeProperties } from 'n8n-workflow';

export type QuoResource = 'message' | 'contact' | 'call' | 'phoneNumber';

export type MessageOperation = 'send' | 'get' | 'getMany';
export type ContactOperation = 'get' | 'getMany' | 'create' | 'update' | 'delete';
export type CallOperation = 'get' | 'getMany' | 'getRecording' | 'getTranscription' | 'getSummary';
export type PhoneNumberOperation = 'get' | 'getMany';

export const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Message',
			value: 'message',
			description: 'Send and retrieve SMS messages',
		},
		{
			name: 'Contact',
			value: 'contact',
			description: 'Manage contacts',
		},
		{
			name: 'Call',
			value: 'call',
			description: 'Retrieve call records, recordings, and transcriptions',
		},
		{
			name: 'Phone Number',
			value: 'phoneNumber',
			description: 'Retrieve phone numbers in your workspace',
		},
	],
	default: 'message',
};
