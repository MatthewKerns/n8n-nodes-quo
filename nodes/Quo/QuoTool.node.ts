import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class QuoTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Quo Tool',
		name: 'quoTool',
		icon: 'file:quo.svg',
		group: ['transform'],
		version: 1,
		description: 'AI Tool for querying Quo phone system (contacts, calls, messages, users)',
		defaults: {
			name: 'Quo Tool',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Tools'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://github.com/MatthewKerns/n8n-nodes-quo',
					},
				],
			},
		},
		inputs: ['main'],
		outputs: ['main'],
		outputNames: ['ai_tool'],
		credentials: [
			{
				name: 'quoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: 'quo_search',
				description: 'The name of the function to be called, could contain underscores',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: 'Search Quo phone system for contacts, calls, messages, and users. Parameters: resource (contact|call|message|user), search (optional search term), phone (optional phone number), participants (optional participant phone number for filtering calls/messages), conversationId (optional for messages), userId (optional user ID), limit (optional result limit, default 10)',
				description:
					'Used by the AI to understand when to call this tool',
				typeOptions: {
					rows: 3,
				},
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				// For AI Tool: read from incoming JSON data (from AI agent)
				// For manual execution: fall back to node parameters
				const inputData = items[i].json;
				const resource = (inputData.resource as string) || (this.getNodeParameter('resource', i, 'contact') as string);
				const search = (inputData.search as string) || (this.getNodeParameter('search', i, '') as string);
				const phone = (inputData.phone as string) || (this.getNodeParameter('phone', i, '') as string);
				const participants = (inputData.participants as string) || (this.getNodeParameter('participants', i, '') as string);
				const conversationId = (inputData.conversationId as string) || (this.getNodeParameter('conversationId', i, '') as string);
				const userId = (inputData.userId as string) || (this.getNodeParameter('userId', i, '') as string);
				const limit = (inputData.limit as number) || (this.getNodeParameter('limit', i, 10) as number);

				const credentials = await this.getCredentials('quoApi');
				const apiKey = credentials.apiKey as string;

				// Build API request
				let endpoint = 'contacts';
				const params = new URLSearchParams();

				if (resource === 'contact') {
					endpoint = 'contacts';
					if (search) params.append('search', search);
					if (phone) params.append('phoneNumber', phone);
				} else if (resource === 'call') {
					endpoint = 'calls';
					if (participants) params.append('participants', participants);
					if (userId) params.append('userId', userId);
				} else if (resource === 'message') {
					endpoint = 'messages';
					if (participants) params.append('participants', participants);
					if (conversationId) params.append('conversationId', conversationId);
					if (userId) params.append('userId', userId);
				} else if (resource === 'user') {
					endpoint = 'users';
					// Users endpoint supports: id, email, name search
					if (search) params.append('name', search);
				}

				if (limit) params.append('maxResults', limit.toString());

				const url = `https://api.openphone.com/v1/${endpoint}?${params}`;

				const response = await this.helpers.httpRequest({
					method: 'GET',
					url,
					headers: {
						'Authorization': apiKey,
						'Content-Type': 'application/json',
					},
				});

				returnData.push({
					json: response,
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : 'Unknown error' },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
