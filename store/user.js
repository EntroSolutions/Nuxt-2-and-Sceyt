export const state = () => ({
  user: null,
  isConnected: false,
  connectionStatus: 'disconnected'
})

export const mutations = {
  setUser(state, user) {
    state.user = user
    state.isConnected = !!user
  },

  setConnectionStatus(state, status) {
    state.connectionStatus = status
    state.isConnected = status === 'connected'
  },

  clearUser(state) {
    state.user = null
    state.isConnected = false
    state.connectionStatus = 'disconnected'
  }
}

export const actions = {
  async connectUser({ commit }, { userId, userData }) {
    commit('setConnectionStatus', 'connecting')
    
    try {
      const user = await this.$sceyt.connect(userId)
      commit('setUser', { ...user, ...userData })
      commit('setConnectionStatus', 'connected')
      return user
    } catch (error) {
      commit('setConnectionStatus', 'error')
      throw error
    }
  },

  async disconnect({ commit }) {
    try {
      await this.$sceyt.disconnect()
      commit('clearUser')
    } catch (error) {
      console.error('Disconnect error:', error)
      commit('clearUser')
    }
  }
}

export const getters = {
  isConnected: state => state.isConnected,
  currentUser: state => state.user,
  connectionStatus: state => state.connectionStatus
} 