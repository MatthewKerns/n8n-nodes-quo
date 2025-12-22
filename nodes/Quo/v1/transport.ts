import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

const BASE_URL = 'https://api.openphone.com/v1';

export async function quoApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		url: `${BASE_URL}${endpoint}`,
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'quoApi',
		options,
	);

	return response as IDataObject;
}

export async function quoApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	dataKey: string,
	body?: IDataObject,
	query?: IDataObject,
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let nextPageToken: string | undefined;

	do {
		const requestQuery: IDataObject = { ...query };
		if (nextPageToken) {
			requestQuery.pageToken = nextPageToken;
		}

		const response = await quoApiRequest.call(this, method, endpoint, body, requestQuery);

		const items = response[dataKey] as IDataObject[] | undefined;
		if (items) {
			returnData.push(...items);
		}

		nextPageToken = response.nextPageToken as string | undefined;

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (nextPageToken);

	return returnData;
}
