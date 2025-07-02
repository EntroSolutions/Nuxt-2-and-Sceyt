<template>
  <div class="p-4 border-t border-gray-200 bg-white">
    <div class="flex items-end space-x-3">
      <div class="flex-1">
        <div v-if="attachments.length > 0" class="mb-3">
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(attachment, index) in attachments"
              :key="index"
              class="relative bg-gray-100 rounded p-2 flex items-center"
            >
              <span class="text-sm truncate max-w-32">{{ attachment.name }}</span>
              <button
                @click="removeAttachment(index)"
                class="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex items-center border border-gray-300 rounded-lg">
          <textarea
            v-model="messageText"
            ref="messageInput"
            rows="1"
            placeholder="Type a message..."
            class="flex-1 px-4 py-2 border-0 resize-none focus:outline-none rounded-l-lg"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="addNewLine"
            @input="adjustTextareaHeight"
          ></textarea>
          
          <div class="flex items-center px-2">
            <input
              ref="fileInput"
              type="file"
              multiple
              class="hidden"
              @change="handleFileSelect"
            />
            <button
              @click="$refs.fileInput.click()"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Attach file"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <button
        @click="sendMessage"
        :disabled="!canSend"
        class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageText: '',
      attachments: [],
      uploading: false
    }
  },

  computed: {
    canSend() {
      return (this.messageText.trim() || this.attachments.length > 0) && !this.uploading
    }
  },

  methods: {
    async sendMessage() {
      if (!this.canSend) return

      const messageData = {
        body: this.messageText.trim(),
        type: 'text'
      }

      if (this.attachments.length > 0) {
        messageData.attachments = this.attachments
      }

      this.$emit('send-message', messageData)
      
      this.messageText = ''
      this.attachments = []
      this.adjustTextareaHeight()
    },

    addNewLine() {
      this.messageText += '\n'
      this.$nextTick(() => {
        this.adjustTextareaHeight()
      })
    },

    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
      }
    },

    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      
      files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`)
          return
        }
        
        this.attachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        })
      })
      
      event.target.value = ''
    },

    removeAttachment(index) {
      this.attachments.splice(index, 1)
    }
  }
}
</script> 