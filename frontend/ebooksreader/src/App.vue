<script>
  import { RouterLink, RouterView } from 'vue-router'
import api from "./services/api.js";
  
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
      async logarUsuario() {
        const { email, senha } = this;scrollX
        console.log("Tentando logar:", { email, senha });
        const resultado = await api.loginUsuario({
          email: email,
          password: senha
        });

        if(resultado.ok) {
          this.logado = true;
          sessionStorage.setItem("logado", true);
          const user = await resultado.json();
          sessionStorage.setItem("user", JSON.stringify(user));
          console.log("Logado:", { user });
        } else {
          const {error} = await resultado.json();
          alert(error);
        }
      },
      async criarUsuario(){
        const { email, senha, nome } = this;
          // aqui você pode fazer a lógica de criação de conta
          const resultado = await api.criarUsuario({
            email: email,
            password: senha,
            name: nome
          });

          console.log("Criado:", { resultado });
          if(resultado.ok) {
            this.logarUsuario();
          } else {
            const {error} = await resultado.json();
            alert(error);
          }
        },
        logout() {
          this.logado = false;
          sessionStorage.removeItem("logado");
          sessionStorage.removeItem("user");
          console.log("Deslogado");
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
        <a class="logout" v-if="logado" href="#" @click.prevent="logout">Sair</a>
      </nav>
      
      <!-- exemplo de uso do v-if (se a variável advice não for undefined ou nulo, exibe o conselho) -->
      <p v-if="advice">"{{ advice }}"</p>
    </div>
  </header>

  <RouterView v-if="logado" />

  <div class="form-login-wrapper">
    <form v-if="!logado && naoCriado" @submit.prevent="logarUsuario">
      <!-- criar form de login ou criação de conta -->
      <h2>Login</h2>
      <input type="text" placeholder="Email" v-model="email" />
      <!-- Senha dos usuários teste é 123456 -->
      <input type="password" placeholder="Senha" v-model="senha" />
      <aside>
        <button type="submit">Logar</button>
        <button @click.prevent="() => naoCriado = false">Criar Conta</button>
      </aside>
    </form>

    <form v-if="!logado && !naoCriado" @submit.prevent="criarUsuario">
      <h2>Criar conta</h2>
      <input type="text" placeholder="Nome" v-model="nome" />
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Senha" v-model="senha" />
      <aside>
        <button type="submit">Criar</button>
        <button @click.prevent="() => naoCriado = true">Logar</button>
      </aside>
    </form>
  </div>
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
.form-login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1em;
  margin-block-end: 1em;

  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
    width: 20em;

    input {
      padding: 0.5em;
      border-radius: 0.5em;
      border: 1px solid #ccc;
    }
    aside {
      display: flex;
      align-items: center;
      gap: 1em;
    }
    button {
      padding: 0.5em 1em;
      border-radius: 0.5em;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}
.logout {
  text-decoration: none;
  cursor: pointer;
  color: var(--clr-theme);
}
</style>
