<script>
// api.js é onde você encontra as chamadas para as rotas definidas em server.js no backend.
import api from '../services/api.js'

export default {
  props: [],
  data() {
    return {
      // aqui você pode criar variáveis que podem ser usadas no template
      livros: [],
      pesquisa: undefined,
      debounceTimer: null,
      loading: false,
      errorMsg: null,
    }
  },
  watch: {
    // aqui você pode observar mudanças em variáveis
    pesquisa(novo, velho) {
      // esse método é chamado sempre que a pesquisa muda
      if (novo === velho) return
      // Debounce de 300ms para evitar muitas chamadas
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        if (!this.pesquisa || this.pesquisa.trim() === '') {
          this.listarLivros()
        } else {
          this.buscarLivro()
        }
      }, 300)
    },
  },
  computed: {
    // aqui você pode criar variáveis que dependem de outras
    // por exemplo, você pode criar uma variável que retorna o número de livros
    // esse exemplo é usado no H2 do html abaixo
    numeroLivros() {
      return this.livros.length
    },
  },
  methods: {
    async listarLivros() {
      this.loading = true
      this.errorMsg = null
      try {
        const livros = await api.listarLivros()
        console.log('Livros:', { livros })
        this.livros = livros
      } catch (e) {
        this.errorMsg = 'Não foi possível carregar os livros.'
      } finally {
        this.loading = false
      }
    },
    async buscarLivro() {
      const { pesquisa } = this
      this.loading = true
      this.errorMsg = null
      try {
        const livros = await api.buscarLivros(pesquisa)
        console.log('Livros encontrados:', { livros })
        this.livros = livros
      } catch (e) {
        this.errorMsg = 'Erro ao buscar livros.'
      } finally {
        this.loading = false
      }
    },
    clearSearch() {
      this.pesquisa = ''
    },
    submitSearch() {
      // Ação explícita ao enviar (enter/lupa)
      if (!this.pesquisa || this.pesquisa.trim() === '') {
        this.listarLivros()
      } else {
        this.buscarLivro()
      }
    },
  },
  mounted() {
    // esse método é chamado assim que o componente é montado em tela
    // é chamado apenas uma vez
    console.log('Montado') // mensagens do console.log aparecem no console do navegador
    this.listarLivros()
  },
}
</script>

<template>
  <main>
    <section class="search">
      <form class="search-form" @submit.prevent="submitSearch">
        <div class="search-bar">
          <i class="fas fa-magnifying-glass icon-left" aria-hidden="true"></i>
          <input
            type="search"
            v-model="pesquisa"
            placeholder="Buscar livros, autores..."
            aria-label="Buscar livros"
          />
          <button
            v-if="pesquisa && pesquisa.length"
            type="button"
            class="clear-btn"
            @click="clearSearch"
            aria-label="Limpar busca"
          >
            <i class="fas fa-xmark"></i>
          </button>
          <button type="submit" class="submit-btn" aria-label="Pesquisar">
            <i class="fas fa-magnifying-glass"></i>
          </button>
        </div>
      </form>
    </section>
    <h2>
      <template v-if="pesquisa && pesquisa.trim()">Resultados ({{ numeroLivros }})</template>
      <template v-else>Lista de livros ({{ numeroLivros }})</template>
    </h2>

    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

    <ul v-if="!loading && livros && livros.length > 0">
      <li v-for="livro in livros" :key="livro.isbn">
        <RouterLink :to="`/livro/${livro.isbn}`">
          <img class="cover" :src="livro.cover" alt="Capa do livro" loading="lazy" />
          <h3>{{ livro.title }}</h3>
          <p class="author"><strong>Autor:</strong> {{ livro.author }}</p>
          <p class="description">
            <strong>Descrição:</strong>
            {{
              livro.description.length > 100
                ? livro.description.substring(0, 100) + '...'
                : livro.description
            }}
          </p>
          <div class="rating" v-if="livro.averageRating">
            <span class="rating-badge">{{ livro.averageRating.toFixed(1) }}</span>
            <i
              v-for="i in 5"
              :key="i"
              :class="[livro.averageRating >= i ? 'fas' : 'far', 'fa-star', 'star-icon']"
              :style="{ color: livro.averageRating >= i ? '#f5a623' : '#d1d5db' }"
              aria-hidden="true"
            ></i>
          </div>
          <div class="rating rating-muted" v-else>
            <span class="rating-badge">—</span>
            <span class="no-reviews">Sem avaliações</span>
          </div>
        </RouterLink>
      </li>
    </ul>

    <ul v-else-if="loading" class="skeleton-grid">
      <li v-for="i in 6" :key="i" class="skeleton-card">
        <div class="skeleton-cover shimmer"></div>
        <div class="skeleton-line shimmer" style="width: 70%"></div>
        <div class="skeleton-line shimmer" style="width: 40%"></div>
        <div class="skeleton-line shimmer" style="width: 90%"></div>
      </li>
    </ul>

    <div v-else class="empty-state">
      <i class="fas fa-book-open"></i>
      <p>Nenhum livro encontrado.</p>
      <small>Dica: tente outros termos ou limpe a busca.</small>
    </div>
  </main>
</template>

<style>
/* cores de estrelas herdadas via inline style */
.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  :first-child {
    border: 1px solid orange;
    border-radius: 0.5em;
    padding: 0.5em;
    background: rgba(241, 90, 34, 0.05);
  }
}
.rating .rating-badge {
  font-weight: 600;
  color: #f05a22;
}
.rating .star-icon {
  font-size: 0.95rem;
}
.rating.rating-muted {
  color: #9ca3af;
}
.rating .no-reviews {
  font-size: 0.9em;
}
section.search {
  display: flex;
  justify-content: center;
  margin-block-end: 1.25em;
  padding: 0 1rem;
}
.search-form {
  width: 100%;
  max-width: 42rem;
}
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.35rem 0.5rem 0.35rem 2.25rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}
.search-bar:focus-within {
  border-color: #165193;
  box-shadow: 0 8px 22px rgba(22, 81, 147, 0.18);
}
.search-bar input[type='search'] {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.5rem 2.5rem 0.5rem 0;
  background: transparent;
}
.search-bar .icon-left {
  position: absolute;
  left: 0.85rem;
  color: #9ca3af;
  font-size: 1rem;
  pointer-events: none;
}
.search-bar .clear-btn,
.search-bar .submit-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
}
.search-bar .clear-btn:hover,
.search-bar .submit-btn:hover {
  color: #374151;
}
.search-bar .submit-btn {
  margin-right: 0.25rem;
}
header {
  h1 {
    font-size: 2em;
    margin-block-end: 0.5em;
  }

  p {
    font-size: 1.2em;
    margin-block-end: 1em;
    color: #666;
    font-style: italic;
  }
}

h2 {
  font-size: 1.75em;
  font-weight: 600;
  margin-bottom: 1em;
}

ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16em, 1fr));
  gap: 1.5em;
  padding: 0;
  list-style: none;

  li {
    background-color: #fff;
    min-height: 28em;
    border-radius: 1em;
    padding: 1.25em;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    &:hover {
      transform: translateY(-0.5em);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
    > a {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      text-decoration: none;
      color: inherit;

      img.cover {
        width: 100%;
        height: 190px;
        border-radius: 0.75em;
        margin-bottom: 1em;
        object-fit: cover;
      }

      h3 {
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 2.5rem;
        line-height: 1.25rem;
        font-size: 1.1em;
        margin-block-end: 0.25em;
      }

      .author,
      .description {
        color: #666;
        font-size: 0.9em;
      }

      .description {
        font-size: 0.85em;
        margin-block-end: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      p {
        color: #666;
      }

      p.author {
        margin-block: 0.5em;
      }
      p.description {
        font-size: 0.8em;
      }
    }
  }
}

.average-rating {
  margin-top: 0.5em;
  font-size: 1em;
  color: #333;
}

.error-msg {
  color: #b91c1c;
  margin-bottom: 1rem;
}
.empty-state {
  margin-top: 1rem;
  text-align: center;
  color: #6b7280;
}
.empty-state i {
  font-size: 2rem;
  margin-bottom: 0.25rem;
  color: #9ca3af;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16em, 1fr));
  gap: 1.5em;
  padding: 0;
  list-style: none;
}
.skeleton-card {
  background: #fff;
  border-radius: 1em;
  padding: 1.25em;
}
.skeleton-cover {
  height: 190px;
  border-radius: 0.75em;
  background: #e5e7eb;
  margin-bottom: 1em;
}
.skeleton-line {
  height: 10px;
  background: #e5e7eb;
  border-radius: 4px;
  margin: 0.5em 0;
}
.shimmer {
  position: relative;
  overflow: hidden;
}
.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150px;
  height: 100%;
  width: 150px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.6),
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 1.3s infinite;
}
@keyframes shimmer {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(300px);
  }
}

form {
  margin-top: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
form input[type='number'] {
  width: 5em;
}
form button {
  align-self: flex-start;
}
</style>
