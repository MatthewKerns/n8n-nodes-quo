import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { quoApiRequest, quoApiRequestAllItems } from '../../transport';

export { phoneNumberOperations, phoneNumberFields } from './phoneNumber.operations';

export async function executePhoneNumberOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const phoneNumberId = this.getNodeParameter('phoneNumberId', itemIndex) as string;

		responseData = await quoApiRequest.call(this, 'GET', `/phone-numbers/${phoneNumberId}`);

	} else if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			responseData = await quoApiRequestAllItems.call(
				this,
				'GET',
				'/phone-numbers',
				'data',
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const response = await quoApiRequest.call(this, 'GET', '/phone-numbers', undefined, { maxResults: limit });
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
