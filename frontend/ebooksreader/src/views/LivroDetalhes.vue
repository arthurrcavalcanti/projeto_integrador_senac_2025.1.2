<script>
import api from '../services/api.js'
import { buscarImagemUsuario } from '../services/api.js'
import HeartButton from '../components/HeartButton.vue'
import AddToListButton from '../components/AddToListButton.vue'

export default {
  components: { HeartButton, AddToListButton },
  props: ['id'], // recebe o id do livro como propriedade no caso vinda da query string
  data() {
    return {
      livro: undefined,
      content: '',
      rating: 0,
      reviews: [], // Inicializa a lista de reviews
      usuario: undefined,
      showFullDesc: false,
      successMsg: null,
      errorMsg: null,
      sendingReview: false,
      sendingCommentId: null,
      isLiked: false,
    }
  },
  methods: {
    buscarImagemUsuario,
    avatarUrlFor(user) {
      if (!user?.id) return 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      return this.buscarImagemUsuario(user.id)
    },
    onAvatarError(e) {
      // Evita loop caso a imagem de fallback também falhe
      e.target.onerror = null
      e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    async buscarLivro() {
      const response = await api.buscarLivros(this.id)
      console.log('Livro encontrado:', { response })
      if (response) {
        this.livro = response[0]
        this.listarReviews()
        this.verificarCurtida()
      }
    },
    async verificarCurtida() {
      if (!this.usuario || !this.livro) return
      try {
        const { hasLiked } = await api.verificarCurtida(this.usuario.id, this.livro.id)
        this.isLiked = hasLiked
      } catch (e) {
        console.error('Erro ao verificar curtida:', e)
      }
    },
    onLiked() {
      this.isLiked = true
    },
    onUnliked() {
      this.isLiked = false
    },
    async avaliarLivro() {
      const { livro, content, rating } = this
      if (!livro?.id || !rating || rating < 1 || rating > 5) {
        this.errorMsg = 'Por favor, insira uma nota válida de 1 a 5.'
        setTimeout(() => (this.errorMsg = null), 2500)
        return
      }
      this.sendingReview = true
      try {
        await api.enviarReview({
          book_id: livro.id,
          rating: rating,
          content: content,
          user_id: this.usuario.id,
          review_id: null,
        })
        this.content = ''
        this.rating = 0
        await this.listarReviews()
        this.successMsg = 'Avaliação enviada!'
        setTimeout(() => (this.successMsg = null), 2000)
      } catch (error) {
        console.error('Erro ao enviar avaliação:', error)
        this.errorMsg = 'Erro ao enviar avaliação.'
        setTimeout(() => (this.errorMsg = null), 2500)
      } finally {
        this.sendingReview = false
      }
    },
    async comentar(reviewResponse) {
      const { livro } = this
      if (!reviewResponse?.responseMsg || !reviewResponse.id) return
      this.sendingCommentId = reviewResponse.id
      try {
        await api.enviarReview({
          book_id: livro.id,
          rating: reviewResponse.rating,
          content: reviewResponse.responseMsg,
          user_id: this.usuario.id,
          review_id: reviewResponse.id,
        })
        reviewResponse.responseMsg = ''
        await this.listarReviews()
        this.successMsg = 'Comentário enviado!'
        setTimeout(() => (this.successMsg = null), 2000)
      } catch (error) {
        console.error('Erro ao enviar comentário:', error)
        this.errorMsg = 'Erro ao enviar comentário.'
        setTimeout(() => (this.errorMsg = null), 2500)
      } finally {
        this.sendingCommentId = null
      }
    },
    async listarReviews() {
      const { livro } = this
      if (!livro?.id) return
      const response = await api.listarReviews(livro.id)
      console.log('Reviews encontrados:', { response })
      if (response) {
        this.reviews = response.map((r) => ({
          ...r,
          showComents: false,
          responseMsg: '',
        }))
      }
    },
    selectStar(nota) {
      this.rating = nota
    },
    async deletarReview(id) {
      if (!confirm('Tem certeza que deseja apagar esta avaliação?')) return
      try {
        await api.deletarReview(id)
        this.listarReviews()
      } catch (e) {
        alert(e.message || 'Falha ao deletar')
      }
    },
  },
  mounted() {
    console.log('LivroDetalhes Montado')
    console.log('ID do livro:', this.id)
    this.buscarLivro()
    const logado = sessionStorage.getItem('logado')
    if (logado) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user) {
        console.log('Montado, usuário: ', { user })
        this.usuario = user
      }
    }
  },
}
</script>

<template>
  <div v-if="livro" class="detalhes-livro">
    <!-- Cabeçalho -->
    <div class="livro-header">
      <img :src="livro.cover" alt="Capa do livro" class="livro-capa" />
      <div class="livro-info">
        <div class="title-heart-wrapper">
          <h1>{{ livro.title }}</h1>
          <div v-if="usuario && livro" class="book-actions">
            <HeartButton
              :book-id="livro.id"
              :user-id="usuario.id"
              :initial-liked="isLiked"
              @liked="onLiked"
              @unliked="onUnliked"
            />
            <AddToListButton :book-id="livro.id" :user-id="usuario.id" />
          </div>
        </div>

        <div class="livro-meta">
          <span class="chip"><i class="fas fa-user-pen"></i> {{ livro.author }}</span>
        </div>

        <p class="descricao" :class="{ clamp: !showFullDesc }">
          {{ livro.description }}
        </p>
        <button
          v-if="livro?.description && livro.description.length > 220"
          class="btn-link"
          @click.prevent="showFullDesc = !showFullDesc"
        >
          {{ showFullDesc ? 'Ver menos' : 'Ver mais' }}
        </button>
      </div>
    </div>

    <!-- Formulário de avaliação -->
    <form class="review-form card" @submit.prevent="avaliarLivro">
      <h3>Faça sua avaliação</h3>

      <div class="rating-define" role="radiogroup" aria-label="Definir nota">
        <button
          v-for="i in 5"
          :key="'rate-' + i"
          type="button"
          class="star-btn"
          :disabled="sendingReview"
          :aria-pressed="rating >= i"
          :aria-label="`Nota ${i}`"
          @click="selectStar(i)"
          @keydown.enter.prevent="selectStar(i)"
          @keydown.space.prevent="selectStar(i)"
        >
          <!-- Alterado: binding explícito de classes e cor -->
          <i
            :class="[rating >= i ? 'fas' : 'far', 'fa-star']"
            :style="{ color: rating >= i ? '#f5a623' : '#ccc' }"
          ></i>
        </button>
      </div>

      <textarea
        v-model="content"
        placeholder="Escreva seu comentário..."
        :disabled="sendingReview"
      ></textarea>
      <button type="submit" class="btn-enviar" :disabled="sendingReview">
        {{ sendingReview ? 'Enviando...' : 'Enviar avaliação' }}
      </button>
      <p v-if="successMsg" class="msg success">{{ successMsg }}</p>
      <p v-if="errorMsg" class="msg error">{{ errorMsg }}</p>
    </form>

    <!-- Lista de reviews -->
    <div class="reviews-container">
      <h3>O que as pessoas acharam</h3>

      <div
        v-for="review in reviews.filter((r) => !r.review_id)"
        :key="review.id"
        class="review-card"
      >
        <div class="review-header">
          <img
            :src="avatarUrlFor(review.user)"
            alt="Foto do usuário"
            class="user-foto"
            @error="onAvatarError"
          />
          <div class="review-meta">
            <h4>{{ review.user?.name }}</h4>
            <div class="rating-detalhes" aria-label="Nota do review">
              <i
                v-for="i in 5"
                :key="'rv-' + review.id + '-' + i"
                :class="[review.rating >= i ? 'fas' : 'far', 'fa-star']"
                :style="{ color: review.rating >= i ? '#f5a623' : '#ccc' }"
              ></i>
            </div>
          </div>
          <button
            v-if="usuario && review.user?.id === usuario.id && !review.review_id"
            class="icon-delete"
            @click.prevent="deletarReview(review.id)"
            aria-label="Excluir avaliação"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>

        <p class="review-content">{{ review.content }}</p>

        <button class="btn-comentarios" @click.prevent="review.showComents = !review.showComents">
          {{ review.showComents ? 'Esconder comentários' : 'Mostrar comentários' }}
        </button>

        <div v-if="review.showComents" class="comments">
          <div
            v-for="comment in reviews.filter((r) => r.review_id == review.id)"
            :key="comment.id"
            class="comment"
          >
            <div class="comment-header">
              <img
                :src="avatarUrlFor(comment.user)"
                alt="Foto do usuário"
                class="user-foto small"
                @error="onAvatarError"
              />
              <strong>{{ comment.user?.name }}</strong>
              <button
                v-if="usuario && comment.user?.id === usuario.id && comment.review_id"
                class="icon-delete"
                @click.prevent="deletarReview(comment.id)"
                aria-label="Excluir comentário"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <p>{{ comment.content }}</p>
          </div>

          <form class="comment-form" @submit.prevent="comentar(review)">
            <textarea
              v-model="review.responseMsg"
              placeholder="Escreva um comentário..."
              :disabled="sendingCommentId === review.id"
            ></textarea>
            <button type="submit" class="btn-enviar" :disabled="sendingCommentId === review.id">
              {{ sendingCommentId === review.id ? 'Enviando...' : 'Comentar' }}
            </button>
            <p v-if="successMsg && sendingCommentId === null" class="msg success">
              {{ successMsg }}
            </p>
            <p v-if="errorMsg && sendingCommentId === null" class="msg error">{{ errorMsg }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* TODO: adicionar estilos a página */
.detalhes-livro {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Cabeçalho */
.livro-header {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  background: linear-gradient(135deg, #ffffff 0%, #f7f9ff 100%);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #eef1f6;
}

.livro-capa {
  width: 180px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 4px solid #fff;
}

.livro-info {
  flex: 1;
}

.title-heart-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  position: relative;
}

.title-heart-wrapper .book-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.livro-info h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
  color: #1f2937;
  letter-spacing: 0.2px;
  flex: 1;
}

.livro-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.25rem 0 0.75rem 0;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #eef2ff;
  color: #3b4aa1;
  border: 1px solid #e2e8ff;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.descricao {
  color: #4b5563;
  line-height: 1.7;
  font-size: 1rem;
}

.descricao.clamp {
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4; /* número de linhas quando colapsado */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-link {
  background: transparent;
  border: none;
  color: #165193;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
  margin-top: 0.25rem;
}
.btn-link:hover {
  text-decoration: underline;
}

/* Cards */
.card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

/* Formulário de avaliação */
.review-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-form h3 {
  font-size: 1.2rem;
  color: #333;
}

.rating-define {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.star-btn {
  background: transparent;
  border: none;
  padding: 0.2rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
}

.star-btn:focus {
  outline: none;
}
.star-btn:focus:not(:focus-visible) {
  outline: none;
}
.star-btn:focus-visible {
  outline: 2px solid #165193;
  outline-offset: 2px;
  border-radius: 6px;
}

.fa-star {
  font-size: 1.6rem;
  transition: color 0.15s ease-in-out;
}

.text-gold {
  color: #f5a623;
}
.text-gray {
  color: #ccc;
}

.review-form textarea {
  width: 100%;
  min-height: 90px;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0.8rem;
  font-size: 0.95rem;
  resize: none;
}

.btn-enviar {
  background-color: #165193;
  color: #fff;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-enviar:hover {
  background-color: #103f72;
}

.btn-enviar:disabled,
textarea:disabled,
.star-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Reviews */
.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.user-foto {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-foto.small {
  width: 35px;
  height: 35px;
}

.rating-detalhes {
  display: flex;
  gap: 0.2rem;
}

.rating-detalhes .fa-star {
  font-size: 1.2rem;
}

/* Responsividade */
@media (max-width: 640px) {
  .livro-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .livro-capa {
    width: 140px;
  }
  .livro-info h1 {
    font-size: 1.6rem;
  }
}

.review-content {
  color: #444;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Comentários */
.comments {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}

.comment {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
  position: relative;
}

.comment-form textarea {
  min-height: 60px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.9rem;
  resize: none;
}

.btn-comentarios {
  background: none;
  border: none;
  color: #165193;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-start;
}

.btn-comentarios:hover {
  text-decoration: underline;
}

.msg {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
.msg.success {
  color: #2e7d32;
}
.msg.error {
  color: #c62828;
}

/* Botão de excluir como ícone vermelho, à direita e centralizado */
.icon-delete {
  background: transparent;
  border: none;
  color: #e53935;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  position: absolute;
  right: 0.25rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.25rem;
}
.icon-delete:hover {
  color: #c62828;
}
</style>
