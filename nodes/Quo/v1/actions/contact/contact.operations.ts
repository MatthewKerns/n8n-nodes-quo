import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['contact'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new contact',
			action: 'Create a contact',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a contact',
			action: 'Delete a contact',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a contact by ID',
			action: 'Get a contact',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get multiple contacts',
			action: 'Get many contacts',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a contact',
			action: 'Update a contact',
		},
	],
	default: 'get',
};

export const contactFields: INodeProperties[] = [
	// ----------------------------------
	//         contact:get / update / delete
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the contact',
	},

	// ----------------------------------
	//         contact:create
	// ----------------------------------
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		description: 'The first name of the contact',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		description: 'The last name of the contact',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'The company name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'The email address of the contact',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'The phone number of the contact (E.164 format)',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'string',
				default: '',
				description: 'The role or job title of the contact',
			},
		],
	},

	// ----------------------------------
	//         contact:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['contact'],
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
				resource: ['contact'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         contact:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'The first name of the contact',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'The last name of the contact',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'The company name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'The email address of the contact',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'The phone number of the contact (E.164 format)',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'string',
				default: '',
				description: 'The role or job title of the contact',
			},
		],
	},
];
