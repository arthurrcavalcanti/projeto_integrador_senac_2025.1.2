<script>
// api.js é onde você encontra as chamadas para as rotas definidas em server.js no backend.
import api from "../services/api.js";

export default {
  props: [],
  data() {
    return {
      isbn: undefined,
      title: undefined,
      author: undefined,
      description: undefined,
      cover: undefined,
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    async adicionarLivro() {
      const { isbn, title, author, description, cover } = this;
      const livro = {
        isbn,
        title,
        author,
        description,
        cover
      }

      if(!isbn || !title || !author || !description || !cover) {
        alert("Preencha todos os campos");
        return;
      }

      console.log("Adicionando livro:", {livro});
      api.adicionarLivro(livro);
    }
  },
  mounted() {
    console.log("Adicionar livros montado");
  }
}
</script>

<template>
  <header>
    <h1>Você pode adicionar livros aqui</h1>
    <p>Pesquise um livro abaixo usando o código isbn, título ou autor</p>
  </header>
  <main>
    <form v-on:submit.prevent="adicionarLivro" class="adding-form">

      <label for="title">Título</label>
      <input type="text" id="title" v-model="title" placeholder="Digite o título do livro" />

      <label for="author">Autor</label>
      <input type="text" id="author" v-model="author" placeholder="Digite autor do livro" />

      <label for="description">Descrição</label>
      <textarea id="description" v-model="description"></textarea>

      <label for="cover">Capa</label>
      <input type="text" id="cover" v-model="cover" placeholder="Digite a url para capa do livro" />

      <label for="isbn">Código ISBN</label>
      <input type="text" id="isbn" v-model="isbn" placeholder="Digite o título do livro" />

      <button type="submit">Adicionar</button>

    </form>
  </main>
</template>

<style>
.adding-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-block: 1em;
  width: 20em;
  label {
    font-weight: 700;
    margin-block-end: -0.5em;
  }
  input {
    padding: .5em
  }
  
  textarea {
    height: 10em;
  }

  button {
    padding:.5em 1em;
  }
  padding-block-end: 1em;
  border-block-end: 1px solid #ccc;
}

.lista-livros {
  margin-block: 1em;
  h2 {
    font-size: 1.5em;
    margin-block-end: 0.5em;
  }
}
</style>
