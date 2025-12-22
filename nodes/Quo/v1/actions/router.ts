import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeMessageOperation } from './message';
import { executeContactOperation } from './contact';
import { executeCallOperation } from './call';
import { executePhoneNumberOperation } from './phoneNumber';

export async function router(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	const resource = this.getNodeParameter('resource', 0) as string;

	for (let i = 0; i < items.length; i++) {
		try {
			const operation = this.getNodeParameter('operation', i) as string;
			let results: INodeExecutionData[];

			switch (resource) {
				case 'message':
					results = await executeMessageOperation.call(this, operation, i);
					break;
				case 'contact':
					results = await executeContactOperation.call(this, operation, i);
					break;
				case 'call':
					results = await executeCallOperation.call(this, operation, i);
					break;
				case 'phoneNumber':
					results = await executePhoneNumberOperation.call(this, operation, i);
					break;
				default:
					throw new Error(`Unknown resource: ${resource}`);
			}

			// Add pairedItem information for item linking
			results = results.map(result => ({
				...result,
				pairedItem: { item: i },
			}));

			returnData.push(...results);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return [returnData];
}
