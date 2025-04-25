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
    }
  },
  watch: {
    // aqui você pode observar mudanças em variáveis
    pesquisa(novo, velho) {
      // esse método é chamado sempre que a pesquisa muda
      if (novo !== velho) {
        this.buscarLivro()
      }
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
    // aqui você pode criar métodos que podem ser chamados em qualquer lugar
    async listarLivros() {
      const livros = await api.listarLivros()
      console.log('Livros:', { livros })
      this.livros = livros
    },
    async buscarLivro() {
      const { pesquisa } = this
      const livros = await api.buscarLivros(pesquisa)
      console.log('Livros encontrados:', { livros })
      this.livros = livros
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
    <section>
      <input type="text" placeholder="Buscar livro" v-model="pesquisa" />
    </section>

    <h2>Lista de livros ({{ numeroLivros }})</h2>
    <ul>
      <li v-for="livro in livros" :key="livro.isbn">
        <RouterLink :to="`/livro/${livro.isbn}`">
          <img class="cover" :src="livro.cover" alt="Capa do livro" />
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
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style>
section {
  display: flex;
  justify-content: start;
  margin-block-end: 1em;
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
  font-size: 1.5em;
  margin-block-end: 0.5em;
}

ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;

  li {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 0.5em;
    padding: 1em;
    max-width: 15em;
    background-color: white;
    > a {
      text-decoration: none;
      padding: 0.5em 1em;
      display: flex;
      flex-direction: column;

      img {
        max-width: 8em;
        align-self: center;
        border-radius: 0.5em;
        margin-block-end: 0.5em;
      }

      h3 {
        font-size: 1.2em;
        margin-block-end: 0.5em;
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
</style>
