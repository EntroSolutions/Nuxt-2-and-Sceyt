<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <nuxt-link to="/" class="text-xl font-bold text-gray-900">
              Sceyt Chat
            </nuxt-link>
          </div>
          <nav class="flex space-x-8">
            <nuxt-link to="/" class="text-gray-500 hover:text-gray-900">
              Home
            </nuxt-link>
            <nuxt-link to="/chat" class="text-gray-500 hover:text-gray-900">
              Chat
            </nuxt-link>
            <nuxt-link to="/rooms" class="text-gray-500 hover:text-gray-900">
              Rooms
            </nuxt-link>
          </nav>
        </div>
      </div>
    </header>
    <main>
      <Nuxt />
    </main>
  </div>
</template>

<style scoped>
.nuxt-link-active {
  @apply text-blue-600 font-medium;
}
</style> 