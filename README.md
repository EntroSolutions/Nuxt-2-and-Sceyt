# Nuxt 2 + Sceyt-Style Chat Application

A real-time chat application built with Nuxt 2 demonstrating Sceyt-like messaging functionality. This demo uses a mock implementation to showcase the integration patterns and UI/UX design.

## Features

- Real-time messaging interface with mock Sceyt SDK
- Channel/Room management
- File attachments support (UI ready)
- Responsive design with Tailwind CSS
- User authentication and connection management
- Message history and pagination
- Professional chat interface

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Build

Build for production:

```bash
npm run build
npm run start
```

## Project Structure

```
├── assets/css/          # Global styles
├── components/          # Vue components
│   ├── ChannelList.vue  # Channel sidebar
│   ├── ChatHeader.vue   # Chat header
│   ├── MessageList.vue  # Message display
│   └── MessageInput.vue # Message input form
├── layouts/             # App layouts
├── pages/               # App pages/routes
│   ├── index.vue        # Landing page
│   ├── chat.vue         # Main chat interface
│   └── rooms.vue        # Room browser
├── plugins/             # Nuxt plugins
│   └── sceyt.client.js  # Mock Sceyt SDK implementation
├── store/               # Vuex store
│   └── user.js          # User state management
└── nuxt.config.js       # Nuxt configuration
```

## Usage

1. Visit the homepage and enter your username and user ID
2. Connect to the mock chat system
3. Navigate to the chat page to start messaging
4. Browse rooms to join existing conversations
5. Create new channels and rooms as needed

## Mock Implementation

This project uses a mock Sceyt implementation for demonstration purposes. The mock includes:

- User authentication simulation
- Channel management
- Message sending/receiving
- File upload interface
- Real-time-like messaging experience

## Technologies Used

- **Nuxt 2** - Vue.js framework
- **Mock Sceyt SDK** - Simulated messaging functionality
- **Tailwind CSS** - Modern styling
- **Vuex** - State management
- **Socket.io Client** - For future real-time features

## Integrating Real Sceyt SDK

To integrate with the actual Sceyt SDK:

1. Replace the mock implementation in `plugins/sceyt.client.js`
2. Install the official Sceyt SDK package
3. Update the configuration with real Sceyt credentials
4. Adjust API calls to match Sceyt's actual API

## License

MIT