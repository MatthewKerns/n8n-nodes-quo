import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { quoApiRequest, quoApiRequestAllItems } from '../../transport';

export { messageOperations, messageFields } from './message.operations';

export async function executeMessageOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'send') {
		throw new Error('Send operation is disabled in read-only mode. Write operations are not available for Quo node.');
		const phoneNumberId = this.getNodeParameter('phoneNumberId', itemIndex) as string;
		const to = this.getNodeParameter('to', itemIndex) as string;
		const content = this.getNodeParameter('content', itemIndex) as string;

		const body: IDataObject = {
			from: phoneNumberId,
			to: [to],
			content,
		};

		responseData = await quoApiRequest.call(this, 'POST', '/messages', body);

	} else if (operation === 'get') {
		const messageId = this.getNodeParameter('messageId', itemIndex) as string;

		responseData = await quoApiRequest.call(this, 'GET', `/messages/${messageId}`);

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
				'/messages',
				'data',
				undefined,
				query,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			query.maxResults = limit;
			const response = await quoApiRequest.call(this, 'GET', '/messages', undefined, query);
			responseData = (response.data as IDataObject[]) || [];
		}

	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	if (Array.isArray(responseData)) {
		return responseData.map(data => ({ json: data }));
	}

	return [{ json: responseData }];
}
