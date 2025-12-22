import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { quoApiRequest, quoApiRequestAllItems } from '../../transport';

export { callOperations, callFields } from './call.operations';

export async function executeCallOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const callId = this.getNodeParameter('callId', itemIndex) as string;

		responseData = await quoApiRequest.call(this, 'GET', `/calls/${callId}`);

	} else if (operation === 'getMany') {
		const phoneNumberId = this.getNodeParameter('phoneNumberId', itemIndex) as string;
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const query: IDataObject = {
			phoneNumberId,
		};

		if (filters.participantPhoneNumber) {
			query.participants = filters.participantPhoneNumber;
		}

		if (returnAll) {
			responseData = await quoApiRequestAllItems.call(
				this,
				'GET',
				'/calls',
				'data',
				undefined,
				query,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			query.maxResults = limit;
			const response = await quoApiRequest.call(this, 'GET', '/calls', undefined, query);
			responseData = (response.data as IDataObject[]) || [];
		}

	} else if (operation === 'getRecording') {
		const callId = this.getNodeParameter('callId', itemIndex) as string;

		responseData = await quoApiRequest.call(this, 'GET', `/calls/${callId}/recording`);

	} else if (operation === 'getTranscription') {
		const callId = this.getNodeParameter('callId', itemIndex) as string;

		responseData = await quoApiRequest.call(this, 'GET', `/calls/${callId}/transcription`);

	} else if (operation === 'getSummary') {
		const callId = this.getNodeParameter('callId', itemIndex) as string;

		responseData = await quoApiRequest.call(this, 'GET', `/calls/${callId}/summary`);

	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	if (Array.isArray(responseData)) {
		return responseData.map(data => ({ json: data }));
	}

	return [{ json: responseData }];
}
