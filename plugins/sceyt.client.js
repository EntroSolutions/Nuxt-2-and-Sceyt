import SceytChat from 'sceyt-chat'

export default function ({ app }, inject) {
  const sceytClient = new SceytChat(
    process.env.SCEYT_API_URL || 'https://us-ohio-api.sceyt.com',
    process.env.SCEYT_APP_ID || 'your-app-id-here',
    process.env.SCEYT_CLIENT_ID || `client_${Date.now()}`
  )

  const connectionListener = new sceytClient.ConnectionListener()
  
  connectionListener.onConnectionStatusChanged = async (status) => {
    console.log('Sceyt connection status changed:', status)
  }

  connectionListener.onTokenWillExpire = async (timeInterval) => {
    console.log('Sceyt token will expire in', timeInterval/1000, 'seconds')
  }

  connectionListener.onTokenExpired = async () => {
    console.log('Sceyt access token has expired')
  }

  sceytClient.addConnectionListener('nuxt-connection-listener', connectionListener)

  inject('sceyt', sceytClient)
} 