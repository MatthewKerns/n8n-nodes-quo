import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { QuoV1 } from './v1/QuoV1.node';

export class Quo extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Quo',
			name: 'quo',
			icon: 'file:quo.svg',
			group: ['transform'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Interact with Quo API - business phone system (formerly OpenPhone)',
			defaultVersion: 1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new QuoV1(),
		};

		super(nodeVersions, baseDescription);
	}
}
