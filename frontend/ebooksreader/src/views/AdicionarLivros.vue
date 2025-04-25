<script>
// api.js é onde você encontra as chamadas para as rotas definidas em server.js no backend.
import api from '../services/api.js'

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
    //exemplo de uso do watch de uma propriedade
    isbn(novo, velho) {
      // se novo == velho, não faz nada
      if (novo === velho) return

      console.log('ISBN alterado de', velho, 'para', novo)
      if (novo.length > 7) {
        this.buscarLivroISBN(novo)
      }
    },
  },
  computed: {},
  methods: {
    async buscarLivroISBN(valor) {
      // api de consulta da openlibrary
      // https://openlibrary.org/dev/docs/api/books
      const url = `https://openlibrary.org/isbn/${valor}.json`
      const response = await fetch(url)
      let authorKey = undefined
      if (!response.ok) {
        console.log('Erro ao buscar livro:', { response })
        return
      }

      // verifica se a resposta é ok (status 200)
      if (response.ok) {
        const data = await response.json()
        console.log('Livro encontrado:', { data })

        if (data.description) {
          this.description = data.description
        } else {
          if (data.works) {
            const work = data.works[0].key
            const urlWork = `https://openlibrary.org${work}.json`
            const responseWork = await fetch(urlWork)
            if (responseWork.ok) {
              const dataWork = await responseWork.json()
              console.log('Work encontrado:', { dataWork })
              authorKey = dataWork.authors?.[0]?.author?.key
              if (dataWork.description.value) {
                this.description = dataWork.description.value
              } else {
                this.description = dataWork.description
              }
            } else {
              console.log('Erro ao buscar work:', { responseWork })
            }
          }
        }
        this.title = data.title

        this.cover = `https://covers.openlibrary.org/b/id/${data.covers?.[0]}-M.jpg` // -M é médio, -S é pequeno, -L é grande

        const author = data.authors?.[0]?.key ?? authorKey
        // se não encontrar o autor, tenta pegar o primeiro autor da lista de colaboradores
        if (!author) {
          const contributors = data.contributors?.find((c) => c.role == 'Author')?.name
          if (contributors) {
            this.author = contributors
          }
        }

        if (author) {
          const urlAuthor = `https://openlibrary.org${author}.json`

          const responseAuthor = await fetch(urlAuthor)
          if (responseAuthor.ok) {
            const dataAuthor = await responseAuthor.json()
            console.log('Author Author:', { dataAuthor })
            this.author = dataAuthor.name
          }
        }
      }
    },
    async adicionarLivro() {
      const { isbn, title, author, description, cover } = this
      const livro = {
        isbn,
        title,
        author,
        description,
        cover,
      }

      if (!isbn || !title || !author || !description || !cover) {
        alert('Preencha todos os campos')
        return
      }

      console.log('Adicionando livro:', { livro })
      api.adicionarLivro(livro)
    },
  },
  mounted() {
    console.log('Adicionar livros montado')
  },
}
</script>

<template>
  <header>
    <h1>Você pode adicionar livros aqui</h1>
    <p>Preencha as informações do livro abaixo</p>
    <p>
      Não sabe o ISBN do livro procure em
      <a href="https://openlibrary.org/" target="_blank">https://openlibrary.org/</a>
    </p>
  </header>
  <main>
    <form v-on:submit.prevent="adicionarLivro" class="adding-form">
      <!-- icone da fontawesome -->
      <label for="isbn"
        >Código ISBN
        <i class="fa fa-info-circle" title="Pesquisa automaticamente na api da openlibrary"></i
      ></label>
      <input type="text" id="isbn" v-model="isbn" placeholder="Digite o código ISBN do livro" />

      <label for="title">Título</label>
      <input type="text" id="title" v-model="title" placeholder="Digite o título do livro" />

      <label for="author">Autor</label>
      <input type="text" id="author" v-model="author" placeholder="Digite autor do livro" />

      <label for="description">Descrição</label>
      <textarea id="description" v-model="description"></textarea>

      <label for="cover">Capa</label>
      <input type="text" id="cover" v-model="cover" placeholder="Digite a url para capa do livro" />

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

  textarea {
    height: 10em;
  }

  button {
    padding: 0.5em 1em;
  }
  padding-block-end: 1em;
  border-block-end: 1px solid #ccc;
}
</style>
