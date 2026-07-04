
# radioshack_be

A multicast audio streaming API with a backchannel for listener feedback.

## Overview

`radioshack_be` is the backend service powering **Radioshack**, a platform for broadcasting live audio to multiple listeners (multicast streaming) while allowing listeners to send feedback, reactions, or messages back to the broadcaster in real time via a dedicated backchannel.

The service handles:

- Audio stream session management (create, join, leave, end)
- Real-time multicast audio distribution via LiveKit
- A WebSocket-based backchannel for listener feedback (reactions, chat, signals)
- Authentication and authorization
- Persistence of streams, sessions, and feedback data

## Tech Stack

- **Runtime:** Node.js
- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Database:** SQL (e.g. PostgreSQL)
- **Real-time communication:** WebSockets (NestJS Gateway)
- **Media infrastructure:** [LiveKit](https://livekit.io/) (WebRTC-based audio streaming)
- **Language:** TypeScript

## Architecture

```
Client (Broadcaster / Listener)
        │
        ▼
   NestJS API ──── WebSocket Gateway (backchannel feedback)
        │
        ▼
   LiveKit Server (multicast audio streaming)
        │
        ▼
   SQL Database (streams, sessions, feedback, users)
```

- **Broadcasters** publish audio to a LiveKit room.
- **Listeners** subscribe to the room to receive the multicast audio stream.
- **Feedback backchannel** runs over WebSockets, allowing listeners to send reactions/messages that are routed back to the broadcaster and/or other listeners without interrupting the audio stream.

## Prerequisites

- Node.js >= `<NODE_VERSION>`
- npm / yarn / pnpm
- A running SQL database instance (e.g. PostgreSQL)
- A LiveKit server instance (self-hosted or LiveKit Cloud)

## Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/NwankwoKc/radioshack_be.git>
cd radioshack_be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# App
DATABASEURL="postgresql://postgres.adaviomgajmjkxefeeag:RPBo6peVZrcfzhmX@aws-1-eu-west-2.pooler.supabase.com:6543/postgres"
NODEENV='development'  
PORT=3000
POSTGRESPASSWORD="mysecretpassword"
APIKEY='APIcFKT2xPzgpAA'
SECRETEKEY='sTjspHnv47QvDi2o3RnMv13BkRCAkuzGOBeobhr2joB'
```

### 4. Run database migrations

```bash
npm run typeorm:migration:run
```

### 5. Start the application

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:<PORT>`.

## Project Structure

```
src/
├── controller/               # Controllers 
├── model/            # Sschema and validations, Shared utilities, guards, interceptors, DTOs
├── service/            # Services
├── utils/        # WebSocket gateway for listener feedback and types
├── app.controller.ts/             
├── app.mocule.ts/             # Apllication module for controllers,service, DB connection
├── app.service.ts/             
└── main.ts             # Application entry point
```

## Core Features

### Multicast Audio Streaming

- Broadcasters create a stream, which provisions a LiveKit room.
- Listeners request a join token and connect via WebRTC to receive the audio in real time.
- Stream metadata (title, status, listener) is persisted in the database.

### Backchannel for Listener Feedback

- A dedicated WebSocket namespace/gateway handles listener-to-broadcaster (and listener-to-listener, if enabled) feedback.
- Supports use cases such as:
  - Reactions (e.g. emoji/likes)
  - Text messages / chat
  - Custom signals (e.g. "raise hand", polls, upvotes)
- Feedback events are decoupled from the audio pipeline, ensuring low-latency streaming is unaffected by feedback traffic.

## API Documentation
API is available on Postman through this link below
```
https://www.postman.com/solar-star-425396/workspace/radioshack
```

## WebSocket Events

| Event                  | Direction            | Description                          |
|-------------------------|----------------------|--------------------------------------|
| `<EVENT_NAME>`          | Client → Server      | `<DESCRIPTION>`                       |
| `<EVENT_NAME>`          | Server → Client      | `<DESCRIPTION>`                       |

## Testing

```bash
# unit tests
npm run test
```

## Scripts

| Script                    | Description                          |
|---------------------------|--------------------------------------|
| `npm run start:dev`       | Run app in watch mode                |
| `npm run build`           | Build the project                    |
| `npm run start:prod`      | Run compiled app                     |
| `npm run lint`            | Lint codebase                        |
| `npm run test`            | Run unit tests                       |


## Contributing

Contributions are welcome. Please open an issue or submit a pull request with a clear description of the change.

## License

`MIT`
