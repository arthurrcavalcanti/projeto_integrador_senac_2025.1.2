<script>
// importa a chamada da API
import { atualizarUsuario } from '../services/api.js'

export default {
  props: [],
  data() {
    return {
      usuario: undefined,
      newusername: '',
      newemail: '',
      newpassword: '',
    }
  },
  methods: {
    async atualizarNome() {
      try {
        const atualizado = await atualizarUsuario({
          ...this.usuario,
          name: this.newusername || this.usuario.name,
        })
        this.usuario = atualizado
        sessionStorage.setItem('user', JSON.stringify(atualizado))
        this.usuario.editarNome = false
        this.newusername = ''
      } catch (err) {
        console.error('Erro ao atualizar nome:', err.message)
      }
    },
    async atualizarEmail() {
      try {
        const atualizado = await atualizarUsuario({
          ...this.usuario,
          email: this.newemail || this.usuario.email,
        })
        this.usuario = atualizado
        sessionStorage.setItem('user', JSON.stringify(atualizado))
        this.usuario.editarEmail = false
        this.newemail = ''
      } catch (err) {
        console.error('Erro ao atualizar email:', err.message)
      }
    },
    async atualizarSenha() {
      try {
        const atualizado = await atualizarUsuario({
          ...this.usuario,
          password: this.newpassword,
        })
        this.usuario = atualizado
        sessionStorage.setItem('user', JSON.stringify(atualizado))
        this.usuario.editarSenha = false
        this.newpassword = ''
      } catch (err) {
        console.error('Erro ao atualizar senha:', err.message)
      }
    },
  },
  mounted() {
    console.log('Montado usuário detalhes')
    const logado = sessionStorage.getItem('logado')
    if (logado) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user) {
        console.log('Montado, usuário: ', { user })
        this.usuario = {
          ...user,
          editarNome: false,
          editarEmail: false,
          editarSenha: false,
        }
      }
    }
  },
}
</script>

<template>
  <main v-if="usuario">
    <h2>Meu perfil</h2>

    <!-- Nome -->
    <div>
      <label>Nome:</label>
      <span v-if="!usuario.editarNome">{{ usuario.name }}</span>
      <input
        v-if="usuario.editarNome"
        type="text"
        v-model="newusername"
        :placeholder="usuario.name"
      />
      <button v-if="!usuario.editarNome" @click.prevent="usuario.editarNome = true" title="Editar">
        <i class="fas fa-edit"></i>
      </button>
      <button v-if="usuario.editarNome" @click.prevent="atualizarNome">Atualizar</button>
      <button
        v-if="usuario.editarNome"
        @click.prevent="() => (usuario.editarNome = !usuario.editarNome)"
      >
        Cancelar
      </button>
    </div>

    <!-- Email -->
    <div>
      <label>Email:</label>
      <span v-if="!usuario.editarEmail">{{ usuario.email }}</span>
      <input
        v-if="usuario.editarEmail"
        type="email"
        v-model="newemail"
        :placeholder="usuario.email"
      />
      <button
        v-if="!usuario.editarEmail"
        @click.prevent="usuario.editarEmail = true"
        title="Editar"
      >
        <i class="fas fa-edit"></i>
      </button>
      <button v-if="usuario.editarEmail" @click.prevent="atualizarEmail">Atualizar</button>
      <button
        v-if="usuario.editarEmail"
        @click.prevent="() => (usuario.editarEmail = !usuario.editarEmail)"
      >
        Cancelar
      </button>
    </div>

    <!-- Senha -->
    <div>
      <label>Senha:</label>
      <span v-if="!usuario.editarSenha">********</span>
      <input v-if="usuario.editarSenha" type="password" v-model="newpassword" />
      <button
        v-if="!usuario.editarSenha"
        @click.prevent="usuario.editarSenha = true"
        title="Editar"
      >
        <i class="fas fa-edit"></i>
      </button>
      <button v-if="usuario.editarSenha" @click.prevent="atualizarSenha">Atualizar</button>
      <button
        v-if="usuario.editarSenha"
        @click.prevent="() => (usuario.editarSenha = !usuario.editarSenha)"
      >
        Cancelar
      </button>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: bold;
  margin-right: 0.5rem;
}

input {
  margin-right: 0.5rem;
}
</style>
