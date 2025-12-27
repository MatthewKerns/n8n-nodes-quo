# Quo Integration Specification

**Service:** Quo (formerly OpenPhone) - Business Communications
**API Type:** REST
**Base URL:** `https://api.openphone.com/v1`
**n8n Node:** `@arisegroup/n8n-nodes-quo` v0.1.0
**Status:** Core Complete, Enhancement Roadmap Active

---

## Overview

Quo is a business phone system providing:
- Business phone numbers (separate from personal)
- SMS/MMS messaging
- Call management with recording
- AI-powered transcription and summaries
- Voicemail management

---

## Authentication

**Method:** API Key (not Bearer token)

**Obtaining API Keys:**
1. Log into Quo account
2. Navigate to "API" tab in workspace settings
3. Click "Generate API key" with descriptive label
4. Store securely (treat like password)

**Requirements:**
- Active Quo subscription (any plan)
- Owner or Admin role in workspace

**Request Header:**
```
Authorization: YOUR_API_KEY
```

**Note:** Quo does NOT use Bearer token authentication. Include the raw API key directly.

**SMS Requirement:** To send SMS to US numbers via API, complete US Carrier Registration.

---

## API Resources & Operations

| Resource | Operations | Description |
|----------|-----------|-------------|
| **Messages** | send, get, getMany | Send/receive SMS/MMS, list with filtering |
| **Calls** | get, getMany | Call history, duration, participants |
| **Call Recordings** | get | Audio recordings of calls |
| **Call Transcripts** | get | Full text transcription (Business+ plans) |
| **Call Summaries** | get | AI-generated call summary (Business+ plans) |
| **Voicemails** | get, getMany | Voicemail audio and transcription |
| **Contacts** | create, get, getMany, update, delete | Contact management with custom fields |
| **Phone Numbers** | get, getMany | Workspace phone numbers and users |
| **Users** | get, getMany | Workspace user information |
| **Conversations** | get, getMany | Threaded message/call history |

---

## Rate Limits

| Aspect | Details |
|--------|---------|
| **Limits** | Vary by endpoint and subscription level |
| **Monitoring** | Check API response headers for usage |
| **Best Practice** | Implement throttling in requests |

**When Exceeded:** Returns rate limit error (implement exponential backoff)

---

## Webhook Events

| Event | Description | Payload Includes |
|-------|-------------|-----------------|
| `call.ringing` | Incoming/outgoing call started | Call ID, participants, direction |
| `call.completed` | Call ended | Call ID, duration, status |
| `call.recording.completed` | Recording ready | Call ID, recording URL |
| `call.transcript.completed` | Transcription ready | Call ID, full transcript |
| `call.summary.completed` | AI summary ready | Call ID, summary text |
| `message.received` | Incoming SMS/MMS | Message ID, content, sender |
| `message.delivered` | Outbound SMS delivered | Message ID, status |

**Payload Structure:**
```json
{
  "id": "evt_unique_id",
  "type": "call.completed",
  "apiVersion": "v4",
  "createdAt": "2025-01-15T10:30:00Z",
  "data": {
    "callId": "call_123",
    "from": "+16025551234",
    "to": "+16025555678",
    "duration": 180,
    "status": "completed"
  }
}
```

**Important:** Webhooks created in Quo app are NOT compatible with API webhooks. Must configure via API for programmatic access.

---

## AI Features (Business+ Plans)

### Call Transcription
- Automatic transcription of all calls
- Available via `call.transcript.completed` webhook
- Accessible via GET `/calls/{id}/transcript`

### Call Summaries
- AI-generated summary of call content
- Includes key points and action items
- Available via `call.summary.completed` webhook
- Accessible via GET `/calls/{id}/summary`

---

## n8n Node Implementation

### Node Types
| Node | Description |
|------|-------------|
| **Quo** | Main action node (CRUD operations) |
| **QuoTrigger** | Webhook trigger node |

### Current Operations

| Resource | Operations |
|----------|-----------|
| **Message** | send, get, getMany |
| **Contact** | create, get, getMany, update, delete |
| **Call** | get, getMany, getRecording, getTranscription, getSummary |
| **Phone Number** | get, getMany |

### File Structure
```
n8n-nodes-quo/
├── .auto-claude/              # AI planning artifacts
│   ├── specs/                 # Feature specifications
│   ├── roadmap/               # Development roadmap (JSON)
│   └── ideation/              # Improvement ideas
├── .worktrees/                # 13 feature branch worktrees
├── credentials/
│   └── QuoApi.credentials.ts
├── nodes/Quo/
│   ├── Quo.node.ts            # Versioned wrapper
│   ├── QuoTrigger.node.ts     # Webhook trigger
│   └── v1/
│       ├── QuoV1.node.ts      # Main implementation
│       ├── transport.ts       # API layer
│       └── actions/           # Operation handlers
└── dist/                      # Compiled output
```

---

## API Documentation

- [Quo API Docs](https://www.quo.com/docs/api)
- [Webhooks Guide](https://www.quo.com/docs/mdx/guides/webhooks)
- [Authentication](https://www.quo.com/docs/mdx/api-reference/authentication)

---

*Last Updated: December 26, 2025*
