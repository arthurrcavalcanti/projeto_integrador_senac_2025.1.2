<script>
import { RouterLink, RouterView } from 'vue-router'
import api from './services/api.js'

export default {
  name: 'App',
  props: [],
  data() {
    return {
      logado: false,
      naoCriado: true,
      email: undefined,
      senha: undefined,
      nome: undefined,
      currentUser: null,
      showAvatar: true,
    }
  },
  watch: {},
  computed: {
    avatarUrl() {
      if (!this.currentUser) return null
      return api.buscarImagemUsuario(this.currentUser.id)
    },
    userName() {
      return this.currentUser?.name || 'Usuário'
    },
    userInitials() {
      const n = this.currentUser?.name?.trim()
      if (!n) return 'U'
      const parts = n.split(' ')
      const a = parts[0]?.[0] || ''
      const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
      return (a + b).toUpperCase()
    },
  },
  methods: {
    async logarUsuario() {
      const { email, senha } = this
      scrollX
      console.log('Tentando logar:', { email, senha })
      const resultado = await api.loginUsuario({
        email: email,
        password: senha,
      })

      if (resultado.ok) {
        this.logado = true
        sessionStorage.setItem('logado', true)
        const user = await resultado.json()
        sessionStorage.setItem('user', JSON.stringify(user))
        console.log('Logado:', { user })
        this.currentUser = user
      } else {
        const { error } = await resultado.json()
        alert(error)
      }
    },
    async criarUsuario() {
      const { email, senha, nome } = this
      // aqui você pode fazer a lógica de criação de conta
      const resultado = await api.criarUsuario({
        email: email,
        password: senha,
        name: nome,
      })

      console.log('Criado:', { resultado })
      if (resultado.ok) {
        this.logarUsuario()
      } else {
        const { error } = await resultado.json()
        alert(error)
      }
    },
    logout() {
      this.logado = false
      sessionStorage.removeItem('logado')
      sessionStorage.removeItem('user')
      console.log('Deslogado')
      this.currentUser = null
      this.showAvatar = true
    },
  },
  mounted() {
    console.log('App Montado')
    const l = sessionStorage.getItem('logado')
    this.logado = l === true || l === 'true'
    try {
      const u = sessionStorage.getItem('user')
      this.currentUser = u ? JSON.parse(u) : null
    } catch (e) {
      this.currentUser = null
    }
  },
}
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/" class="logo-link" aria-label="Ir para a página inicial">
          <img class="logo-img" src="../public/ReadUp_logo_2.png" alt="Logo ReadUp" />
        </RouterLink>
        <RouterLink v-if="logado" to="/">Lista de livros</RouterLink>
        <RouterLink v-if="logado" to="/add-livros">Adicionar Livros</RouterLink>
      </nav>

      <div v-if="logado" class="user-box">
        <RouterLink to="/user" class="user-link" title="Meu perfil">
          <span class="avatar" v-if="showAvatar && avatarUrl">
            <img :src="avatarUrl" alt="Foto do usuário" @error="showAvatar = false" />
          </span>
          <span v-else class="avatar-fallback" aria-hidden="true">{{ userInitials }}</span>
          <span class="username">{{ userName }}</span>
        </RouterLink>
        <button class="logout-btn" @click.prevent="logout" title="Sair">
          <i class="fas fa-right-from-bracket" aria-hidden="true"></i>
          <span class="sr-only">Sair</span>
        </button>
      </div>
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
        <button @click.prevent="() => (naoCriado = false)">Criar Conta</button>
      </aside>
    </form>

    <form v-if="!logado && !naoCriado" @submit.prevent="criarUsuario">
      <h2>Criar conta</h2>
      <input type="text" placeholder="Nome" v-model="nome" />
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Senha" v-model="senha" />
      <aside>
        <button type="submit">Criar</button>
        <button @click.prevent="() => (naoCriado = true)">Logar</button>
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
    .logo-link {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
    }
    .logo-link:hover {
      text-decoration: none;
    }
  }
  .user-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .user-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: inherit;
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    transition: background-color 0.2s;
  }
  .user-link:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    background: #f3f4f6;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .avatar-fallback {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #165193;
    color: #fff;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .username {
    font-weight: 600;
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
.logout-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
}
.logout-btn:hover {
  color: #374151;
  background-color: rgba(0, 0, 0, 0.04);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
