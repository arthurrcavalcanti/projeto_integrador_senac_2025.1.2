<script>
import { curtirLivro, descurtirLivro } from '../services/api.js'

export default {
  props: {
    bookId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    initialLiked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      liked: this.initialLiked,
      loading: false,
    }
  },
  watch: {
    initialLiked(newVal) {
      this.liked = newVal
    },
  },
  methods: {
    async toggleLike() {
      if (this.loading) return

      this.loading = true
      const previousState = this.liked

      try {
        if (this.liked) {
          await descurtirLivro(this.userId, this.bookId)
          this.liked = false
          this.$emit('unliked', this.bookId)
        } else {
          await curtirLivro(this.userId, this.bookId)
          this.liked = true
          this.$emit('liked', this.bookId)
        }
      } catch (error) {
        console.error('Erro ao curtir/descurtir:', error)
        this.liked = previousState
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <button
    class="heart-btn"
    :class="{ liked: liked, loading: loading }"
    @click.prevent.stop="toggleLike"
    :disabled="loading"
    :aria-label="liked ? 'Remover curtida' : 'Curtir livro'"
  >
    <i :class="[liked ? 'fas' : 'far', 'fa-heart']"></i>
  </button>
</template>

<style scoped>
.heart-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  color: #9ca3af;
  transition: all 0.2s ease;
  padding: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.heart-btn:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  transform: scale(1.1);
}

.heart-btn.liked {
  color: #ef4444;
}

.heart-btn.liked:hover {
  color: #dc2626;
}

.heart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.heart-btn:active:not(:disabled) {
  transform: scale(0.95);
}

/* Animação de "pulso" ao curtir */
.heart-btn.liked i {
  animation: heartPulse 0.3s ease;
}

@keyframes heartPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
