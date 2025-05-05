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
  async listarLivros() {
    const livros = await api.listarLivros()
    console.log('Livros:', { livros })
    // Inicializar novaNota para cada livro
    this.livros = livros
  },
  async buscarLivro() {
    const { pesquisa } = this
    const livros = await api.buscarLivros(pesquisa)
    console.log('Livros encontrados:', { livros })
    this.livros = livros
  }
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
    <ul v-if="livros && livros.length > 0">
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
         
          <div class="rating" v-if="livro.averageRating">
            <span>{{ livro.averageRating ? livro.averageRating.toFixed(1) : 'Sem avaliações' }}</span>
            <span :class="{'fa fa-star': true, 'checked': livro.averageRating >= 1}"></span>
            <span :class="{'fa fa-star': true, 'checked': livro.averageRating >= 2}"></span>
            <span :class="{'fa fa-star': true, 'checked': livro.averageRating >= 3}"></span>
            <span :class="{'fa fa-star': true, 'checked': livro.averageRating >= 4}"></span>
            <span :class="{'fa fa-star': true, 'checked': livro.averageRating >= 5}"></span>
          </div>
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style>
.checked {
  color: orange;
}
.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5em;
  :first-child {
    border: 1px solid orange;
    border-radius: 0.5em;
    padding: 0.5em;
    background: rgba(241, 90, 34, 0.05);
  }
}
section {
  display: flex;
  justify-content: center;
  margin-block-end: 1em;
}
section input[type="text"] {
  padding: 0.75em 1em;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 0.75em;
  width: 100%;
  max-width: 30em;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
  &:focus {
    outline: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-color: #007bff;
  }
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-color: #007bff;
  }
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
    transition: transform 0.2s, box-shadow 0.2s;
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
        max-width: 100%;
        border-radius: 0.75em;
        margin-bottom: 1em;
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

      .author, .description {
      color: #666;
      font-size: 0.9em;
      }

      .description {
        font-size: 0.85em;
        margin-block-end: 1.4;
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

form {
  margin-top: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
form input[type="number"] {
  width: 5em;
}
form button {
  align-self: flex-start;
}
</style>
