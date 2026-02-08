import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { quoApiRequest, quoApiRequestAllItems } from '../../transport';

export { contactOperations, contactFields } from './contact.operations';

export async function executeContactOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const contactId = this.getNodeParameter('contactId', itemIndex) as string;

		responseData = await quoApiRequest.call(this, 'GET', `/contacts/${contactId}`);

	} else if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			responseData = await quoApiRequestAllItems.call(
				this,
				'GET',
				'/contacts',
				'data',
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const response = await quoApiRequest.call(this, 'GET', '/contacts', undefined, { maxResults: limit });
			responseData = (response.data as IDataObject[]) || [];
		}

	} else if (operation === 'create') {
throw new Error('Create operation is disabled in read-only mode. Write operations are not available for Quo node.');

		const firstName = this.getNodeParameter('firstName', itemIndex) as string;
		const lastName = this.getNodeParameter('lastName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			firstName,
			lastName,
		};

		if (additionalFields.company) {
			body.company = additionalFields.company;
		}
		if (additionalFields.email) {
			body.emails = [{ value: additionalFields.email, type: 'work' }];
		}
		if (additionalFields.phone) {
			body.phoneNumbers = [{ value: additionalFields.phone, type: 'mobile' }];
		}
		if (additionalFields.role) {
			body.role = additionalFields.role;
		}

		responseData = await quoApiRequest.call(this, 'POST', '/contacts', body);

	} else if (operation === 'update') {
throw new Error('Update operation is disabled in read-only mode. Write operations are not available for Quo node.');

		const contactId = this.getNodeParameter('contactId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.firstName) {
			body.firstName = updateFields.firstName;
		}
		if (updateFields.lastName) {
			body.lastName = updateFields.lastName;
		}
		if (updateFields.company) {
			body.company = updateFields.company;
		}
		if (updateFields.email) {
			body.emails = [{ value: updateFields.email, type: 'work' }];
		}
		if (updateFields.phone) {
			body.phoneNumbers = [{ value: updateFields.phone, type: 'mobile' }];
		}
		if (updateFields.role) {
			body.role = updateFields.role;
		}

		responseData = await quoApiRequest.call(this, 'PATCH', `/contacts/${contactId}`, body);

	} else if (operation === 'delete') {
throw new Error('Delete operation is disabled in read-only mode. Write operations are not available for Quo node.');

		const contactId = this.getNodeParameter('contactId', itemIndex) as string;

		await quoApiRequest.call(this, 'DELETE', `/contacts/${contactId}`);
		responseData = { success: true, deletedId: contactId };

	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	if (Array.isArray(responseData)) {
		return responseData.map(data => ({ json: data }));
	}

	return [{ json: responseData }];
}
