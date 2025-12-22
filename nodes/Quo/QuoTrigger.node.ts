import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

export class QuoTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Quo Trigger',
		name: 'quoTrigger',
		icon: 'file:quo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Quo webhook events',
		defaults: {
			name: 'Quo Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'quoApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'message.received',
				options: [
					{
						name: 'Message Received',
						value: 'message.received',
						description: 'Triggered when a new message is received',
					},
					{
						name: 'Message Delivered',
						value: 'message.delivered',
						description: 'Triggered when a message is delivered',
					},
					{
						name: 'Call Started',
						value: 'call.started',
						description: 'Triggered when a call starts',
					},
					{
						name: 'Call Completed',
						value: 'call.completed',
						description: 'Triggered when a call ends',
					},
					{
						name: 'Call Recording Completed',
						value: 'call.recording.completed',
						description: 'Triggered when a call recording is available',
					},
					{
						name: 'Call Transcription Completed',
						value: 'call.transcription.completed',
						description: 'Triggered when a call transcription is available',
					},
					{
						name: 'Call Summary Completed',
						value: 'call.summary.completed',
						description: 'Triggered when a call summary is available',
					},
				],
			},
			{
				displayName: 'Phone Number ID',
				name: 'phoneNumberId',
				type: 'string',
				default: '',
				description: 'Optional: Filter events to a specific phone number. Leave empty for all phone numbers.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');

				// Check if webhook already registered
				if (webhookData.webhookId) {
					try {
						const endpoint = `/webhooks/${webhookData.webhookId}`;
						await this.helpers.httpRequestWithAuthentication.call(this, 'quoApi', {
							method: 'GET',
							url: `https://api.openphone.com/v1${endpoint}`,
							json: true,
						});
						return true;
					} catch {
						// Webhook doesn't exist anymore
						delete webhookData.webhookId;
						return false;
					}
				}

				// List webhooks to check if one already exists for this URL
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'quoApi', {
					method: 'GET',
					url: 'https://api.openphone.com/v1/webhooks',
					json: true,
				}) as IDataObject;

				const webhooks = (response.data as IDataObject[]) || [];
				for (const webhook of webhooks) {
					if (webhook.url === webhookUrl) {
						webhookData.webhookId = webhook.id;
						return true;
					}
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const phoneNumberId = this.getNodeParameter('phoneNumberId') as string;
				const webhookData = this.getWorkflowStaticData('node');

				const body: IDataObject = {
					url: webhookUrl,
					events: [event],
				};

				if (phoneNumberId) {
					body.phoneNumberId = phoneNumberId;
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'quoApi', {
					method: 'POST',
					url: 'https://api.openphone.com/v1/webhooks',
					body,
					json: true,
				}) as IDataObject;

				webhookData.webhookId = response.id;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await this.helpers.httpRequestWithAuthentication.call(this, 'quoApi', {
							method: 'DELETE',
							url: `https://api.openphone.com/v1/webhooks/${webhookData.webhookId}`,
							json: true,
						});
					} catch (error) {
						// Ignore errors on delete
					}
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		return {
			workflowData: [
				this.helpers.returnJsonArray(bodyData as IDataObject),
			],
		};
	}
}
