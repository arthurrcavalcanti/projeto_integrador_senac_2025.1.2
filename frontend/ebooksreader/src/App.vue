<script>
  import { RouterLink, RouterView } from 'vue-router'
  
  export default {
    name: 'App',
    props: [],
    data() {
      return {
        advice: undefined,
        logado: false,
        naoCriado: true,
        email: undefined,
        senha: undefined,
        nome: undefined,
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
      },
      logarUsuario() {
        const { email, senha } = this;
        // aqui você pode fazer a lógica de login
        // por enquanto só vai logar o usuário
        this.logado = true;
        console.log("Logado:", { email: this.email, senha: this.senha });

        sessionStorage.setItem("logado", true);
      },
      criarUsuario(){
        const { email, senha, nome } = this;
        // aqui você pode fazer a lógica de criação de conta
        }
    },
    mounted() {
      console.log("App Montado");
      this.buscarAdvice();
      this.logado = sessionStorage.getItem("logado");
    }
  }
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <img class="logo-img" src="../public/ReadUp_logo_2.png" alt="Logo ReadUp" />
        <RouterLink  v-if="logado" to="/">Lista de livros</RouterLink>
        <RouterLink  v-if="logado" to="/add-livros">Adicionar Livros</RouterLink>
      </nav>
      
      <!-- exemplo de uso do v-if (se a variável advice não for undefined ou nulo, exibe o conselho) -->
      <p v-if="advice">"{{ advice }}"</p>
    </div>
  </header>

  <RouterView v-if="logado" />
  <form v-if="!logado && naoCriado" @submit.prevent="logarUsuario">
    <!-- criar form de login ou criação de conta -->
    <h2>Login</h2>
    <input type="text" placeholder="Nome" v-model="nome" />
    <input type="text" placeholder="Email" v-model="email" />
    <button type="submit">Logar</button>
    <button @click="() => naoCriado = false">Criar Conta</button>
  </form>

  <form v-if="!logado && !naoCriado" @submit.prevent="criarUsuario">
    <h2>Criar conta</h2>
    <input type="text" placeholder="Nome" v-model="nome" />
    <input type="text" placeholder="Email" v-model="email" />
    <input type="password" placeholder="Senha" v-model="senha" />
    <button type="submit">Criar</button>
  </form>
</template>

<style scoped>
.logo-img {
  max-width: 100px;
}
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
