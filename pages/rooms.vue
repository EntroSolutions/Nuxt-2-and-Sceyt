<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Chat Rooms</h1>
      <button
        @click="showCreateRoom = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Create Room
      </button>
    </div>

    <div v-if="showCreateRoom" class="mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Create New Room</h2>
      <form @submit.prevent="createRoom" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
          <input
            v-model="newRoom.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter room name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            v-model="newRoom.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Room description (optional)"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
          <select
            v-model="newRoom.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="creating"
            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {{ creating ? 'Creating...' : 'Create Room' }}
          </button>
          <button
            type="button"
            @click="cancelCreateRoom"
            class="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-500">Loading rooms...</p>
    </div>

    <div v-else-if="rooms.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">No rooms available</p>
      <p class="text-gray-400 mt-2">Create your first room to get started!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        @click="joinRoom(room)"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ room.metadata?.subject || `Room ${room.id.slice(0, 8)}` }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ room.metadata?.description || 'No description' }}
              </p>
            </div>
            <span
              class="px-2 py-1 text-xs rounded-full"
              :class="{
                'bg-green-100 text-green-800': room.type === 'public',
                'bg-blue-100 text-blue-800': room.type === 'private'
              }"
            >
              {{ room.type }}
            </span>
          </div>
          
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ room.memberCount || 0 }} members</span>
            <span>{{ formatDate(room.createdAt) }}</span>
          </div>
          
          <div v-if="room.lastMessage" class="mt-3 p-2 bg-gray-50 rounded text-sm">
            <p class="truncate">{{ room.lastMessage.body || 'Media message' }}</p>
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
      rooms: [],
      loading: true,
      showCreateRoom: false,
      creating: false,
      newRoom: {
        name: '',
        description: '',
        type: 'public'
      }
    }
  },

  async mounted() {
    if (process.client) {
      if (!this.$sceyt.user) {
        this.$router.push('/')
        return
      }
      await this.loadRooms()
    }
  },

  methods: {
    async loadRooms() {
      this.loading = true
      try {
        const channelQuery = this.$sceyt.getChannelListQuery()
        const response = await channelQuery.load()
        this.rooms = response.channels
      } catch (error) {
        console.error('Error loading rooms:', error)
      } finally {
        this.loading = false
      }
    },

    async createRoom() {
      if (!this.newRoom.name.trim()) return

      this.creating = true
      try {
        const channel = await this.$sceyt.createChannel({
          type: this.newRoom.type,
          metadata: {
            subject: this.newRoom.name,
            description: this.newRoom.description
          }
        })
        
        this.rooms.unshift(channel)
        this.cancelCreateRoom()
      } catch (error) {
        console.error('Error creating room:', error)
        alert('Failed to create room')
      } finally {
        this.creating = false
      }
    },

    cancelCreateRoom() {
      this.showCreateRoom = false
      this.newRoom = {
        name: '',
        description: '',
        type: 'public'
      }
    },

    joinRoom(room) {
      this.$router.push('/chat')
    },

    formatDate(timestamp) {
      if (!timestamp) return 'Unknown'
      return new Date(timestamp).toLocaleDateString()
    }
  }
}
</script> 