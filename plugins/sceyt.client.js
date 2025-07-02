class MockSceytClient {
  constructor(config) {
    this.config = config
    this.user = null
    this.channels = []
    this.messages = new Map()
    this.connected = false
  }

  async connect(userId) {
    this.connected = true
    this.user = {
      id: userId,
      firstName: `User ${userId}`,
      online: true
    }
    return this.user
  }

  async disconnect() {
    this.connected = false
    this.user = null
  }

  getChannelListQuery() {
    return {
      load: async () => {
        const mockChannels = [
          {
            id: 'general',
            type: 'public',
            metadata: { subject: 'General Chat' },
            memberCount: 5,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            lastMessage: {
              body: 'Welcome to the chat!',
              createdAt: new Date().getTime()
            },
            getMessages: () => ({
              load: async () => ({
                messages: this.getChannelMessages('general')
              }),
              loadPrev: async () => ({
                messages: []
              })
            }),
            sendMessage: async (data) => {
              const message = {
                id: Date.now().toString(),
                body: data.body,
                type: data.type || 'text',
                user: this.user,
                createdAt: new Date().getTime(),
                attachments: data.attachments || []
              }
              this.addMessage('general', message)
              return message
            }
          },
          {
            id: 'random',
            type: 'public',
            metadata: { subject: 'Random Discussion' },
            memberCount: 3,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            lastMessage: null,
            getMessages: () => ({
              load: async () => ({
                messages: this.getChannelMessages('random')
              }),
              loadPrev: async () => ({
                messages: []
              })
            }),
            sendMessage: async (data) => {
              const message = {
                id: Date.now().toString(),
                body: data.body,
                type: data.type || 'text',
                user: this.user,
                createdAt: new Date().getTime(),
                attachments: data.attachments || []
              }
              this.addMessage('random', message)
              return message
            }
          }
        ]
        
        this.channels = mockChannels
        return { channels: mockChannels }
      }
    }
  }

  async createChannel(options) {
    const newChannel = {
      id: `channel_${Date.now()}`,
      type: options.type || 'public',
      metadata: options.metadata || {},
      memberCount: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      lastMessage: null,
      getMessages: () => ({
        load: async () => ({
          messages: this.getChannelMessages(newChannel.id)
        }),
        loadPrev: async () => ({
          messages: []
        })
      }),
      sendMessage: async (data) => {
        const message = {
          id: Date.now().toString(),
          body: data.body,
          type: data.type || 'text',
          user: this.user,
          createdAt: new Date().getTime(),
          attachments: data.attachments || []
        }
        this.addMessage(newChannel.id, message)
        return message
      }
    }
    
    this.channels.unshift(newChannel)
    return newChannel
  }

  getChannelMessages(channelId) {
    if (!this.messages.has(channelId)) {
      this.messages.set(channelId, [])
    }
    return this.messages.get(channelId)
  }

  addMessage(channelId, message) {
    if (!this.messages.has(channelId)) {
      this.messages.set(channelId, [])
    }
    this.messages.get(channelId).push(message)
  }
}

export default function ({ app }, inject) {
  const sceytClient = new MockSceytClient({
    appId: process.env.SCEYT_APP_ID || 'demo-app-id',
    baseUrl: process.env.SCEYT_BASE_URL || 'https://demo.sceyt.com',
    apiUrl: process.env.SCEYT_API_URL || 'https://demo.sceyt.com/v1'
  })

  inject('sceyt', sceytClient)
} 