<script>
import { adicionarLivroNaLista, obterListasDoUsuario } from '../services/api.js'
import api from '../services/api.js'

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
  },
  data() {
    return {
      showDropdown: false,
      listas: [],
      novaLista: '',
      criandoLista: false,
      loading: false,
      inAnyList: false,
    }
  },
  methods: {
    async toggleDropdown() {
      this.showDropdown = !this.showDropdown
      if (this.showDropdown) {
        if (this.listas.length === 0) {
          await this.carregarListas()
        }
        await this.verificarSeEstaEmAlgumaLista()
      }
    },
    async carregarListas() {
      try {
        const { lists } = await obterListasDoUsuario(this.userId)
        this.listas = lists || ['Quero Ler']

        // Garantindo que quero ler esteja sempre presente
        if (!this.listas.includes('Quero Ler')) {
          this.listas.unshift('Quero Ler')
        }
      } catch (err) {
        console.error('Erro ao carregar listas:', err)
        this.listas = ['default']
      }
    },
    async adicionarNaLista(listName) {
      this.loading = true
      try {
        await adicionarLivroNaLista(this.userId, this.bookId, listName)
        this.$emit('added', { bookId: this.bookId, listName })

        this.inAnyList = true

        this.showDropdown = false
        alert(`Livro adicionado à lista "${listName}"!`)
      } catch (err) {
        console.error('Erro ao adicionar na lista:', err)
        if (err.message.includes('already in this list')) {
          alert('Este livro já está nesta lista!')
        } else {
          alert('Erro ao adicionar livro na lista')
        }
      } finally {
        this.loading = false
      }
    },
    async criarEAdicionar() {
      if (!this.novaLista.trim()) return
      const nomeNovaLista = this.novaLista.trim()
      this.criandoLista = true
      try {
        await adicionarLivroNaLista(this.userId, this.bookId, nomeNovaLista)
        this.$emit('added', { bookId: this.bookId, listName: nomeNovaLista })

        // Update button state
        this.inAnyList = true

        await this.carregarListas()
        this.novaLista = ''
        this.showDropdown = false
        alert(`Livro adicionado à nova lista "${nomeNovaLista}"!`)
      } catch (err) {
        console.error('Erro ao criar lista:', err)
        alert('Erro ao criar lista e adicionar livro')
      } finally {
        this.criandoLista = false
      }
    },

    async verificarSeEstaEmAlgumaLista() {
      try {
        const { books } = await this.obterTodosLivrosDoUsuario(this.userId)
        this.inAnyList = books.some((book) => book.id === this.bookId)
      } catch (err) {
        console.error('Erro ao verificar se livro está em lista:', err)
        this.inAnyList = false
      }
    },

    async obterTodosLivrosDoUsuario(userId) {
      const resultado = await api.obterTodosLivrosDoUsuario(userId)
      return await resultado
    },

    closeDropdown(e) {
      if (!this.$el.contains(e.target)) {
        this.showDropdown = false
      }
    },
  },
  async mounted() {
    document.addEventListener('click', this.closeDropdown)
    await this.verificarSeEstaEmAlgumaLista()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown)
  },
}
</script>

<template>
  <div class="add-to-list">
    <button
      class="list-btn"
      :class="{ 'in-list': inAnyList }"
      @click.prevent.stop="toggleDropdown"
      :disabled="loading"
      :aria-label="inAnyList ? 'Em uma lista' : 'Adicionar à lista'"
    >
      <i class="fas fa-bookmark"></i>
    </button>

    <div v-if="showDropdown" class="dropdown" @click.stop>
      <h4>Adicionar à lista</h4>

      <ul class="listas-menu">
        <li v-for="lista in listas" :key="lista">
          <button @click.prevent="adicionarNaLista(lista)">
            <i class="fas fa-list"></i>
            {{ lista }}
          </button>
        </li>
      </ul>

      <div class="nova-lista-form">
        <input
          v-model="novaLista"
          type="text"
          placeholder="Nova lista..."
          @keydown.enter.prevent="criarEAdicionar"
        />
        <button @click.prevent="criarEAdicionar" :disabled="!novaLista.trim() || criandoLista">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-to-list {
  position: relative;
  display: inline-block;
}

.list-btn {
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

.list-btn:hover {
  color: #165193;
  background-color: rgba(22, 81, 147, 0.1);
  transform: scale(1.1);
}

.list-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.list-btn.in-list {
  color: #165193;
}

.list-btn.in-list:hover {
  color: #103f72;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  min-width: 200px;
  z-index: 100;
}

.dropdown h4 {
  font-size: 0.9rem;
  color: #555;
  font-weight: 600;
}

.listas-menu {
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem 0;
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.listas-menu li {
  padding: 0;
  min-height: 0;
}

.listas-menu li button {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.5rem 0.75rem;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #444;
}

.listas-menu li button:hover {
  background: #f5f5f5;
}

.listas-menu i {
  color: #165193;
  font-size: 0.9rem;
}

.nova-lista-form {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e5e5;
}

.nova-lista-form input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
}

.nova-lista-form button {
  background: #165193;
  border: none;
  border-radius: 6px;
  color: #fff;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  transition: background 0.2s;
}

.nova-lista-form button:hover:not(:disabled) {
  background: #103f72;
}

.nova-lista-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
