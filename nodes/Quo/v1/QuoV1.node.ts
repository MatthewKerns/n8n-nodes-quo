import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
} from 'n8n-workflow';

import { resourceProperty } from './actions/types';
import { messageOperations, messageFields } from './actions/message';
import { contactOperations, contactFields } from './actions/contact';
import { callOperations, callFields } from './actions/call';
import { phoneNumberOperations, phoneNumberFields } from './actions/phoneNumber';
import { router } from './actions/router';

export class QuoV1 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Quo',
		name: 'quo',
		icon: 'file:../quo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Quo API - business phone system (formerly OpenPhone)',
		defaults: {
			name: 'Quo',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'quoApi',
				required: true,
			},
		],
		properties: [
			resourceProperty,
			// Message
			messageOperations,
			...messageFields,
			// Contact
			contactOperations,
			...contactFields,
			// Call
			callOperations,
			...callFields,
			// Phone Number
			phoneNumberOperations,
			...phoneNumberFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return router.call(this);
	}
}
