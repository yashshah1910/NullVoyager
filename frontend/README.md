# NullVoyager Frontend

A modern Next.js chat interface for the NullVoyager AI Travel Concierge.

## Features

- 🌙 Dark mode UI (similar to ChatGPT/Gemini)
- 💬 Real-time streaming chat with AI
- ✈️ Interactive flight search results
- 🏨 Hotel recommendation cards
- 🗺️ Destination suggestion cards with images
- ⏳ Loading skeletons for better UX
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
cd frontend
pnpm install
```

### Environment Setup

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Update the API URL if your backend is running on a different port:

```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles & Tailwind
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── cards/
│   │   │   ├── destinations-card.tsx
│   │   │   ├── flights-card.tsx
│   │   │   └── hotels-card.tsx
│   │   ├── chat.tsx         # Main chat component
│   │   ├── chat-message.tsx # Message rendering
│   │   ├── tool-invocation.tsx # Tool result renderer
│   │   └── welcome-screen.tsx
│   └── lib/
│       └── utils.ts         # Utility functions
├── tailwind.config.js
└── package.json
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **AI Integration**: Vercel AI SDK (`@ai-sdk/react`)
- **Icons**: Lucide React
- **Markdown**: react-markdown

## Backend Connection

This frontend connects to the NullVoyager backend API. Make sure the backend is running:

```bash
# In the root directory
pnpm dev
```

The frontend uses the `useChat` hook from `@ai-sdk/react` to communicate with the backend's streaming API endpoint.
