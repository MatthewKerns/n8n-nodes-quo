import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
} from 'n8n-workflow';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

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
		inputs: [],
		outputs: ['ai_tool'],
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
				default: 'Search Quo phone system for contacts, calls, messages, and users. Get call transcripts and summaries. Parameters: resource (contact|call|message|user), callId (get specific call with transcript and summary), search (optional search term), phone (optional phone number), participants (optional participant phone number for filtering calls/messages), conversationId (optional for messages), userId (optional user ID), limit (optional result limit, default 10)',
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
				const callId = (inputData.callId as string) || (this.getNodeParameter('callId', i, '') as string);
				const search = (inputData.search as string) || (this.getNodeParameter('search', i, '') as string);
				const phone = (inputData.phone as string) || (this.getNodeParameter('phone', i, '') as string);
				const participants = (inputData.participants as string) || (this.getNodeParameter('participants', i, '') as string);
				const conversationId = (inputData.conversationId as string) || (this.getNodeParameter('conversationId', i, '') as string);
				const userId = (inputData.userId as string) || (this.getNodeParameter('userId', i, '') as string);
				const limit = (inputData.limit as number) || (this.getNodeParameter('limit', i, 10) as number);

				const credentials = await this.getCredentials('quoApi');
				const apiKey = credentials.apiKey as string;

				// If callId is provided with resource='call', get call details with transcript and summary
				if (resource === 'call' && callId) {
					const callUrl = `https://api.openphone.com/v1/calls/${callId}`;
					const transcriptUrl = `https://api.openphone.com/v1/calls/${callId}/transcription`;
					const summaryUrl = `https://api.openphone.com/v1/calls/${callId}/summary`;

					const [callData, transcript, summary] = await Promise.allSettled([
						this.helpers.httpRequest({
							method: 'GET',
							url: callUrl,
							headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
						}),
						this.helpers.httpRequest({
							method: 'GET',
							url: transcriptUrl,
							headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
						}),
						this.helpers.httpRequest({
							method: 'GET',
							url: summaryUrl,
							headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
						}),
					]);

					const result: any = {};
					if (callData.status === 'fulfilled') result.call = callData.value;
					if (transcript.status === 'fulfilled') result.transcript = transcript.value;
					if (summary.status === 'fulfilled') result.summary = summary.value;

					returnData.push({ json: result });
					continue;
				}

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

	async supplyData(this: ISupplyDataFunctions): Promise<SupplyData> {
		const name = this.getNodeParameter('name', 0) as string;
		const description = this.getNodeParameter('description', 0) as string;

		const schema = z.object({
			resource: z.enum(['contact', 'call', 'message', 'user']).describe('Resource type to query'),
			callId: z.string().optional().describe('Call ID to get transcript and summary'),
			search: z.string().optional().describe('Search term for contacts or users'),
			phone: z.string().optional().describe('Phone number to search'),
			participants: z.string().optional().describe('Participant phone number to filter calls/messages'),
			conversationId: z.string().optional().describe('Conversation ID for messages'),
			userId: z.string().optional().describe('User ID for filtering'),
			limit: z.number().optional().describe('Result limit (default 10)'),
		});

		const tool = new DynamicStructuredTool({
			name,
			description,
			schema,
			func: async (input) => {
				const credentials = await this.getCredentials('quoApi');
				const apiKey = credentials.apiKey as string;

				// If callId is provided with resource='call', get call details
				if (input.resource === 'call' && input.callId) {
					const [callData, transcript, summary] = await Promise.allSettled([
						fetch(`https://api.openphone.com/v1/calls/${input.callId}`, {
							headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
						}).then(r => r.json()),
						fetch(`https://api.openphone.com/v1/calls/${input.callId}/transcription`, {
							headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
						}).then(r => r.json()),
						fetch(`https://api.openphone.com/v1/calls/${input.callId}/summary`, {
							headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
						}).then(r => r.json()),
					]);

					const result: any = {};
					if (callData.status === 'fulfilled') result.call = callData.value;
					if (transcript.status === 'fulfilled') result.transcript = transcript.value;
					if (summary.status === 'fulfilled') result.summary = summary.value;

					return JSON.stringify(result);
				}

				// Build API request for listing operations
				const params = new URLSearchParams();
				let endpoint = 'contacts';

				if (input.resource === 'contact') {
					endpoint = 'contacts';
					if (input.search) params.append('search', input.search);
					if (input.phone) params.append('phoneNumber', input.phone);
				} else if (input.resource === 'call') {
					endpoint = 'calls';
					if (input.participants) params.append('participants', input.participants);
					if (input.userId) params.append('userId', input.userId);
				} else if (input.resource === 'message') {
					endpoint = 'messages';
					if (input.participants) params.append('participants', input.participants);
					if (input.conversationId) params.append('conversationId', input.conversationId);
					if (input.userId) params.append('userId', input.userId);
				} else if (input.resource === 'user') {
					endpoint = 'users';
					if (input.search) params.append('name', input.search);
				}

				if (input.limit) params.append('maxResults', input.limit.toString());

				const url = `https://api.openphone.com/v1/${endpoint}?${params}`;
				const response = await fetch(url, {
					headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
				});

				const data = await response.json();
				return JSON.stringify(data);
			},
		});

		return {
			response: tool,
		};
	}
}
