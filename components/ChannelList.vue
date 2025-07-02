<template>
  <div class="h-full flex flex-col">
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Channels</h2>
        <button
          @click="showCreateChannel = true"
          class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          New
        </button>
      </div>
      
      <div v-if="showCreateChannel" class="mb-4 p-3 bg-gray-50 rounded">
        <input
          v-model="newChannelName"
          type="text"
          placeholder="Channel name"
          class="w-full px-2 py-1 border rounded mb-2 text-sm"
          @keyup.enter="createChannel"
        />
        <div class="flex gap-2">
          <button
            @click="createChannel"
            class="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
          >
            Create
          </button>
          <button
            @click="showCreateChannel = false"
            class="bg-gray-400 text-white px-2 py-1 rounded text-xs hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto scroll-container">
      <div v-if="loading" class="p-4 text-center text-gray-500">
        Loading channels...
      </div>
      
      <div v-else-if="channels.length === 0" class="p-4 text-center text-gray-500">
        No channels found. Create one to get started!
      </div>
      
      <div v-else>
        <div
          v-for="channel in channels"
          :key="channel.id"
          @click="selectChannel(channel)"
          class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          :class="{ 'bg-blue-50': selectedChannelId === channel.id }"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="font-medium text-sm">{{ channel.metadata?.subject || channel.id }}</h3>
              <p class="text-xs text-gray-500 truncate">
                {{ getLastMessagePreview(channel) }}
              </p>
            </div>
            <div class="text-xs text-gray-400">
              {{ formatTime(channel.updatedAt) }}
            </div>
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
      channels: [],
      loading: true,
      showCreateChannel: false,
      newChannelName: '',
      selectedChannelId: null
    }
  },

  async mounted() {
    if (process.client) {
      await this.loadChannels()
    }
  },

  methods: {
    async loadChannels() {
      this.loading = true
      try {
        // Using real Sceyt SDK API
        const channelQuery = this.$sceyt.Channel.getChannelListQuery()
        const response = await channelQuery.load()
        this.channels = response.channels || []
      } catch (error) {
        console.error('Error loading channels:', error)
        // For demo, create some sample channels if API fails
        this.channels = [
          {
            id: 'sample-general',
            type: 'public',
            subject: 'General Chat',
            memberCount: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        ]
      } finally {
        this.loading = false
      }
    },

    async createChannel() {
      if (!this.newChannelName.trim()) return

      try {
        const params = {
          type: 'group',
          subject: this.newChannelName,
          members: []
        }
        
        const channel = await this.$sceyt.Channel.create(params)
        
        this.channels.unshift(channel)
        this.newChannelName = ''
        this.showCreateChannel = false
        this.selectChannel(channel)
      } catch (error) {
        console.error('Error creating channel:', error)
        alert('Failed to create channel. Make sure you have valid Sceyt credentials.')
      }
    },

    selectChannel(channel) {
      this.selectedChannelId = channel.id
      this.$emit('channel-selected', channel)
    },

    getLastMessagePreview(channel) {
      if (channel.lastMessage) {
        return channel.lastMessage.body || 'Media message'
      }
      return 'No messages yet'
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = (now - date) / (1000 * 60 * 60)
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        return date.toLocaleDateString()
      }
    }
  }
}
</script> 