<script>
  import { RouterLink, RouterView } from 'vue-router'
  
  export default {
    name: 'App',
    props: [],
    data() {
      return {
        advice: undefined,
      }
    },
    watch: {
    },
    computed: {
    },
    methods: {
      // api de exemplo que busca um conselho aleatório
      async buscarAdvice() {
        // informações sobre api https://api.adviceslip.com/#endpoint-random
        const response = await fetch('https://api.adviceslip.com/advice');
        const data = await response.json();
        console.log("Conselho:", { data });
        
        // usando o modelo do json é possível pegar a propriedade correta, no navegador aparece o json:
        this.advice = data.slip.advice; 
      }
    },
    mounted() {
      console.log("App Montado");
      this.buscarAdvice();
    }
  }
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Lista de livros</RouterLink>
        <RouterLink to="/add-livros">Adicionar Livros</RouterLink>
      </nav>

      <!-- exemplo de uso do v-if (se a variável advice não for undefined ou nulo, exibe o conselho) -->
      <p v-if="advice">"{{ advice }}"</p>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-block-end: 1px solid #ccc;
  margin-block-end: 1em;

  > nav {
    display: flex;
    padding-block: 1em;
    gap: 1em;

    a {
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  > p {
    font-size: 0.9em;
    margin: 0;
  }
}


</style>
