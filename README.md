# n8n-nodes-quo

This is an n8n community node for [Quo](https://www.quo.com) (formerly OpenPhone), a business phone system for startups and small businesses.

## Features

This node allows you to automate your Quo workflows with the following resources:

### Message
- **Send** - Send a text message
- **Get** - Get a message by ID
- **Get Many** - List messages

### Contact
- **Create** - Create a new contact
- **Get** - Get a contact by ID
- **Get Many** - List contacts
- **Update** - Update a contact
- **Delete** - Delete a contact

### Call
- **Get** - Get a call by ID
- **Get Many** - List calls
- **Get Recording** - Get the recording for a call
- **Get Transcription** - Get the transcription for a call
- **Get Summary** - Get the AI summary for a call

### Phone Number
- **Get** - Get a phone number by ID
- **Get Many** - List all phone numbers in the workspace

### Quo Trigger (Webhooks)
- Message Received
- Message Delivered
- Call Started
- Call Completed
- Call Recording Completed
- Call Transcription Completed
- Call Summary Completed

## Prerequisites

- Active Quo subscription
- Owner or Admin workspace role
- API key from your Quo workspace settings
- Completed US carrier registration (for messaging)
- Prepaid messaging credits

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `@arisegroup/n8n-nodes-quo`
4. Agree to the risks and select **Install**

### Manual Installation

To install manually:

```bash
npm install @arisegroup/n8n-nodes-quo
```

## Credentials

1. Log in to your Quo workspace
2. Go to **Settings** > **API**
3. Generate a new API key
4. In n8n, create a new credential of type **Quo API**
5. Paste your API key

## Resources

- [Quo API Documentation](https://www.quo.com/docs/mdx/api-reference/introduction)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
