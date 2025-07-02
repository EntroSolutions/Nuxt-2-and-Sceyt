<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Sceyt Chat
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Real-time messaging powered by Sceyt SDK
      </p>
    </div>

    <div v-if="!isConnected" class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-6 text-center">Connect to Chat</h2>
      <form @submit.prevent="connectUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            User ID
          </label>
          <input
            v-model="userId"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your user ID"
          />
        </div>
        <button
          type="submit"
          :disabled="connecting"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ connecting ? 'Connecting...' : 'Connect' }}
        </button>
      </form>
    </div>

    <div v-else class="text-center">
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        Connected as {{ currentUser.firstName }}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <nuxt-link
          to="/chat"
          class="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Chatting
        </nuxt-link>
        <nuxt-link
          to="/rooms"
          class="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Browse Rooms
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      userId: '',
      connecting: false,
      isConnected: false,
      currentUser: null
    }
  },

  async mounted() {
    if (process.client) {
      this.checkConnection()
    }
  },

  methods: {
    async connectUser() {
      this.connecting = true
      try {
        await this.$sceyt.connect(this.userId)
        
        this.currentUser = {
          id: this.userId,
          firstName: this.username
        }
        
        this.isConnected = true
        this.$store.commit('user/setUser', this.currentUser)
        
      } catch (error) {
        console.error('Connection failed:', error)
        alert('Connection failed. Please try again.')
      } finally {
        this.connecting = false
      }
    },

    checkConnection() {
      if (this.$sceyt.user) {
        this.isConnected = true
        this.currentUser = this.$sceyt.user
      }
    }
  }
}
</script> 