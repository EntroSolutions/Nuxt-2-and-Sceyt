<template>
  <div class="flex-1 overflow-y-auto scroll-container p-4" ref="messageContainer">
    <div v-if="loading && messages.length === 0" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-500">Loading messages...</p>
    </div>

    <div v-if="messages.length > 0" class="space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="{ 'justify-end': isOwnMessage(message) }"
      >
        <div class="max-w-xs lg:max-w-md">
          <div
            class="message-bubble"
            :class="{
              'message-sent': isOwnMessage(message),
              'message-received': !isOwnMessage(message)
            }"
          >
            <div v-if="!isOwnMessage(message)" class="text-xs font-semibold mb-1 text-gray-600">
              {{ getUserDisplayName(message.user) }}
            </div>
            
            <div class="text-sm">
              <div v-if="message.type === 'text'">
                {{ message.body }}
              </div>
              <div v-else-if="message.attachments && message.attachments.length > 0">
                <div v-for="attachment in message.attachments" :key="attachment.id" class="mb-2">
                  <div v-if="attachment.type.startsWith('image/')" class="relative">
                    <img
                      :src="attachment.url"
                      :alt="attachment.name"
                      class="max-w-full h-auto rounded"
                      loading="lazy"
                    />
                  </div>
                  <div v-else class="flex items-center p-2 bg-gray-100 rounded">
                    <div class="flex-1">
                      <p class="text-sm font-medium">{{ attachment.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(attachment.size) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-xs mt-1 opacity-75">
              {{ formatMessageTime(message.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="messages.length === 0 && !loading" class="text-center py-8 text-gray-500">
      <p>No messages yet. Start the conversation!</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    }
  },

  methods: {
    isOwnMessage(message) {
      return message.user?.id === this.$sceyt.user?.id
    },

    getUserDisplayName(user) {
      if (!user) return 'Unknown User'
      return user.firstName || user.id
    },

    formatMessageTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },

    formatFileSize(bytes) {
      if (!bytes) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    scrollToBottom() {
      if (this.$refs.messageContainer) {
        this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight
      }
    }
  }
}
</script> 