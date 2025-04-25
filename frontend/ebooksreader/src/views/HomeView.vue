<script>
import api from "../services/api.js";
export default {
  props: [],
  data() {
    return {
      livros: [],
    }
  },
  watch: {
    // aqui você pode observar mudanças em variáveis
    livros(novoValor, antigoValor) {
      // esse método é chamado sempre que a variável livros muda
      console.log("Livros mudaram:", {novoValor, antigoValor});
    }
  },
  computed: {
    // aqui você pode criar variáveis que dependem de outras
    // por exemplo, você pode criar uma variável que retorna o número de livros
    numeroLivros() {
      return this.livros.length;
    }
  },
  methods: {
    // aqui você pode criar métodos que podem ser chamados em qualquer lugar
    async listarLivros() {
      const livros = await api.listarLivros();
      console.log("Livros:", {livros});
      this.livros = livros;
    }
  },
  mounted() {
    // esse método é chamado assim que o componente é montado em tela
    // é chamado apenas uma vez
    console.log("Montado");
    this.listarLivros();
  }
}
</script>

<template>
  <main>
    <h2>Lista de livros</h2>
    <ul>
      <li v-for="livro in livros" :key="livro.isbn">
        <h3>{{ livro.title }}</h3>
        <p><strong>Autor:</strong> {{ livro.author }}</p>
        <img class="cover" :src="livro.cover" alt="Capa do livro" />
        <p class="description"><strong>Descrição:</strong> {{ livro.description.length > 100 ? livro.description.substring(0, 100) + "..." : livro.description }}</p>
      </li>
    </ul>
  </main>
</template>

<style>
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
      border-radius: 0.5em;
      padding: 1em;
      background: #ccc;
      max-width: 20em;
      gap: 1em;

      img {
        max-width: 20em;
        background: red;
      }

      p.description {
        font-size: 0.8em;
        color: #666;
      }
    }
  }
</style>