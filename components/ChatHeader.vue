<template>
  <div class="p-4 border-b border-gray-200 bg-white">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
          {{ getChannelInitials() }}
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ channelName }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ memberCount }} {{ memberCount === 1 ? 'member' : 'members' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          @click="toggleChannelInfo"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="showChannelInfo" class="mt-4 p-3 bg-gray-50 rounded">
      <h3 class="font-medium mb-2">Channel Information</h3>
      <div class="text-sm text-gray-600 space-y-1">
        <p><span class="font-medium">ID:</span> {{ channel.id }}</p>
        <p><span class="font-medium">Type:</span> {{ channel.type }}</p>
        <p><span class="font-medium">Created:</span> {{ formatDate(channel.createdAt) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    channel: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      showChannelInfo: false
    }
  },

  computed: {
    channelName() {
      return this.channel.metadata?.subject || `Channel ${this.channel.id.slice(0, 8)}`
    },

    memberCount() {
      return this.channel.memberCount || 1
    }
  },

  methods: {
    getChannelInitials() {
      const name = this.channelName
      return name.charAt(0).toUpperCase()
    },

    toggleChannelInfo() {
      this.showChannelInfo = !this.showChannelInfo
    },

    formatDate(timestamp) {
      if (!timestamp) return 'Unknown'
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script> 