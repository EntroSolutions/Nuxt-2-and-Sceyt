<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-lg chat-container">
      <div class="flex h-full">
        <div class="w-1/3 border-r border-gray-200">
          <ChannelList @channel-selected="selectChannel" />
        </div>
        <div class="flex-1 flex flex-col">
          <div v-if="!selectedChannel" class="flex-1 flex items-center justify-center">
            <div class="text-center text-gray-500">
              <h3 class="text-lg font-medium mb-2">Select a channel to start chatting</h3>
              <p>Choose from the channel list or create a new one</p>
            </div>
          </div>
          <div v-else class="flex-1 flex flex-col">
            <ChatHeader :channel="selectedChannel" />
            <MessageList 
              :messages="messages" 
              :loading="loadingMessages"
              @load-more="loadOlderMessages"
            />
            <MessageInput @send-message="sendMessage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedChannel: null,
      messages: [],
      loadingMessages: false
    }
  },

  mounted() {
    if (process.client && !this.$sceyt.user) {
      this.$router.push('/')
    }
  },

  methods: {
    async selectChannel(channel) {
      this.selectedChannel = channel
      this.loadingMessages = true
      
      try {
        const messageQuery = channel.getMessages()
        const response = await messageQuery.load()
        this.messages = response.messages
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        this.loadingMessages = false
      }
    },

    async sendMessage(messageData) {
      if (!this.selectedChannel) return

      try {
        await this.selectedChannel.sendMessage(messageData)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    },

    async loadOlderMessages() {
      if (!this.selectedChannel || this.loadingMessages) return
      
      this.loadingMessages = true
      try {
        const messageQuery = this.selectedChannel.getMessages()
        const response = await messageQuery.loadPrev()
        this.messages = [...response.messages, ...this.messages]
      } catch (error) {
        console.error('Error loading older messages:', error)
      } finally {
        this.loadingMessages = false
      }
    }
  }
}
</script> 