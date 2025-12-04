# 🌍 NullVoyager - AI Travel Concierge Agent

<div align="center">

**An intelligent, conversational travel planning agent built on the NullShot Agent Framework**

[Architecture](#architecture) • [Installation](#installation) • [Features](#features)

</div>

---

### Why NullVoyager?

NullVoyager showcases the power of the NullShot Agent Framework by building a sophisticated AI travel concierge that:

- **Leverages Durable Objects** for persistent, stateful conversations across sessions
- **Implements Multi-Step Reasoning** with tool call streaming for complex trip planning
- **Demonstrates MCP Integration** with external APIs (Unsplash, Wikipedia, Amadeus, Google Places)
- **Features a Modern React Frontend** with real-time streaming responses

---

## ✨ Features

### 🤖 Intelligent Agent Capabilities

| Feature                    | Description                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| **Destination Discovery**  | AI-powered destination suggestions based on travel vibe (adventure, luxury, culture, relaxation) |
| **Flight Search**          | Real-time flight search with pricing via Amadeus API integration                                 |
| **Hotel Recommendations**  | Accommodation search using Google Places API with ratings and pricing                            |
| **Stateful Conversations** | Persistent memory across sessions using Cloudflare Durable Objects                               |
| **Multi-Modal Planning**   | Three-phase approach: Inspiration → Planning → Booking                                           |

### 🛠️ Technical Highlights

- **NullShot Agent Framework**: Built on `@nullshot/agent` for seamless AI agent development
- **AI SDK v5**: Multi-provider support (Anthropic Claude, OpenAI GPT-4)
- **Cloudflare Workers**: Serverless, globally distributed edge deployment
- **MCP Tools**: Extensible tool system via Model Context Protocol
- **Streaming Responses**: Real-time response streaming with tool call streaming
- **Modern UI**: Next.js 15 frontend with Tailwind CSS and modern animations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NullVoyager Architecture                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌─────────────┐         ┌──────────────────────────────────────┐  │
│   │   Next.js   │   API   │        Cloudflare Workers            │  │
│   │   Frontend  │ ──────► │    (NullShot Agent Framework)        │  │
│   │             │ Stream  │                                       │  │
│   └─────────────┘         │  ┌────────────────────────────────┐  │  │
│                           │  │    TravelConciergeAgent        │  │  │
│                           │  │    (extends AiSdkAgent)        │  │  │
│                           │  │                                 │  │  │
│                           │  │  ┌─────────┐  ┌─────────────┐  │  │  │
│                           │  │  │ Durable │  │   AI Model  │  │  │  │
│                           │  │  │ Objects │  │  (Claude/   │  │  │  │
│                           │  │  │ (State) │  │   GPT-4)    │  │  │  │
│                           │  │  └─────────┘  └─────────────┘  │  │  │
│                           │  └────────────────────────────────┘  │  │
│                           │                                       │  │
│                           │  ┌────────────────────────────────┐  │  │
│                           │  │         MCP Tools              │  │  │
│                           │  │  ┌──────────┐ ┌──────────────┐ │  │  │
│                           │  │  │Suggest   │ │Search        │ │  │  │
│                           │  │  │Destinations│ │Flights      │ │  │  │
│                           │  │  └──────────┘ └──────────────┘ │  │  │
│                           │  │  ┌──────────────────────────┐  │  │  │
│                           │  │  │    Search Hotels          │  │  │  │
│                           │  │  └──────────────────────────┘  │  │  │
│                           │  └────────────────────────────────┘  │  │
│                           └──────────────────────────────────────┘  │
│                                           │                          │
│                    ┌──────────────────────┼──────────────────────┐  │
│                    ▼                      ▼                      ▼  │
│            ┌─────────────┐       ┌─────────────┐       ┌─────────┐  │
│            │  Unsplash   │       │   Amadeus   │       │ Google  │  │
│            │    API      │       │     API     │       │ Places  │  │
│            │  (Images)   │       │  (Flights)  │       │  API    │  │
│            └─────────────┘       └─────────────┘       └─────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Agent Flow States

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  INSPIRATION │ ───► │   PLANNING   │ ───► │   BOOKING    │
│    Mode      │      │     Mode     │      │     Mode     │
│              │      │              │      │              │
│ • Discover   │      │ • Flights    │      │ • Review     │
│   destinations│     │ • Hotels     │      │   selections │
│ • Explore    │      │ • Dates      │      │ • Confirm    │
│   vibes      │      │ • Budget     │      │   booking    │
└──────────────┘      └──────────────┘      └──────────────┘
```

---

## 🚀 Installation

### Prerequisites

- Node.js 22+ and pnpm
- Cloudflare account with Workers enabled
- API Keys (see [Environment Variables](#environment-variables))

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yashshah1910/NullVoyager.git
cd NullVoyager

# 2. Install dependencies (backend)
pnpm install

# 3. Install dependencies (frontend)
cd frontend && pnpm install && cd ..

# 4. Set up environment variables
cp .vars-example .dev.vars
# Edit .dev.vars with your API keys

# 5. Set up frontend environment
cp frontend/.env.local.example frontend/.env.local

# 6. Start development servers
# Terminal 1 - Backend (Cloudflare Workers)
pnpm dev

# Terminal 2 - Frontend (Next.js)
cd frontend && pnpm dev
```

### Environment Variables

#### Backend (`.dev.vars`)

```env
AI_PROVIDER=anthropic          # or "openai"
AI_PROVIDER_API_KEY=sk-xxx     # Your AI provider API key
MODEL_ID=claude-3-haiku-20240307  # or your preferred model

# Optional: For enhanced features
UNSPLASH_ACCESS_KEY=xxx        # For destination images
AMADEUS_CLIENT_ID=xxx          # For real flight data
AMADEUS_CLIENT_SECRET=xxx
GOOGLE_PLACES_API_KEY=xxx      # For hotel search
```

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### Production Deployment

```bash
# Deploy backend to Cloudflare Workers
pnpm deploy

# Set production secrets
npx wrangler secret put AI_PROVIDER_API_KEY

# Deploy frontend to Vercel/Cloudflare Pages
cd frontend && pnpm build
```

---

## 📁 Project Structure

```
NullVoyager/
├── src/                          # Backend (Cloudflare Workers)
│   ├── index.ts                  # Main agent implementation
│   ├── types.ts                  # TypeScript type definitions
│   └── tools/                    # AI Agent tools
│       ├── destinations.ts       # Destination suggestion tool
│       ├── flights.ts            # Flight search tool
│       └── hotels.ts             # Hotel search tool
│
├── frontend/                     # Frontend (Next.js 15)
│   └── src/
│       ├── app/                  # Next.js app router
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       ├── components/           # React components
│       │   ├── chat.tsx          # Main chat interface
│       │   ├── chat-message.tsx  # Message rendering
│       │   ├── welcome-screen.tsx
│       │   ├── tool-invocation.tsx
│       │   └── cards/            # Tool result cards
│       │       ├── destinations-card.tsx
│       │       ├── flights-card.tsx
│       │       └── hotels-card.tsx
│       └── lib/
│           └── utils.ts
│
├── mcp.json                      # MCP server configuration
├── wrangler.jsonc               # Cloudflare Workers config
├── package.json
└── README.md
```

---

## 🔧 API Reference

### Chat Endpoint

```
POST /agent/chat/:sessionId?
```

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "I want a relaxing beach vacation"
    }
  ]
}
```

**Response:** Server-Sent Events stream with AI responses and tool results.

### Available Tools

| Tool                   | Description                     | Parameters                                    |
| ---------------------- | ------------------------------- | --------------------------------------------- |
| `suggest_destinations` | Get destination recommendations | `vibe`, `suggested_cities`                    |
| `search_flights`       | Search for flights              | `origin`, `destination`, `date`, `passengers` |
| `search_hotels`        | Search for hotels               | `location`, `checkIn`, `checkOut`             |

---

## 🏆 Hackathon Goals Achieved

✅ **AI Agent Innovation**: Multi-phase travel planning with stateful conversations  
✅ **NullShot Framework**: Built entirely on `@nullshot/agent` and `AiSdkAgent`  
✅ **MCP Tools Integration**: Custom tools for destinations, flights, and hotels  
✅ **Web3 Ready**: Cloudflare Workers infrastructure for decentralized deployment  
✅ **Real-World Utility**: Practical application solving travel planning challenges

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for NullShot Hacks: Season 0**

[![NullShot](https://img.shields.io/badge/Powered%20by-NullShot-10a37f?style=flat-square)](https://nullshot.ai)

</div>
