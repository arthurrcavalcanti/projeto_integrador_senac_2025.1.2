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
      imagePreview: null,
      imageFile: null,
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      this.imageFile = file
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          this.imagePreview = ev.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.imagePreview = null
      }
    },

    async atualizarImagem() {
      if (!this.imageFile) return
      try {
        const formData = new FormData()
        formData.append('id', this.usuario.id)
        formData.append('name', this.usuario.name)
        formData.append('email', this.usuario.email)
        if (this.usuario.password) {
          formData.append('password', this.usuario.password)
        }
        formData.append('image', this.imageFile)
        const atualizado = await atualizarUsuario(formData, true)
        this.usuario = atualizado
        sessionStorage.setItem('user', JSON.stringify(atualizado))
        this.imagePreview = null
        this.imageFile = null
      } catch (err) {
        console.error('Erro ao atualizar imagem:', err.message)
      }
    },

    async atualizarNome() {
      try {
        const formData = new FormData()
        formData.append('id', this.usuario.id)
        formData.append('name', this.newusername || this.usuario.name)
        formData.append('email', this.usuario.email)
        if (this.usuario.password) {
          formData.append('password', this.usuario.password)
        }
        const atualizado = await atualizarUsuario(formData, true)
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
        const formData = new FormData()
        formData.append('id', this.usuario.id)
        formData.append('name', this.usuario.name)
        formData.append('email', this.newemail || this.usuario.email)
        if (this.usuario.password) {
          formData.append('password', this.usuario.password)
        }
        const atualizado = await atualizarUsuario(formData, true)
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
        const formData = new FormData()
        formData.append('id', this.usuario.id)
        formData.append('name', this.usuario.name)
        formData.append('email', this.usuario.email)
        formData.append('password', this.newpassword)
        const atualizado = await atualizarUsuario(formData, true)
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

    <!-- Imagem de perfil -->
    <div>
      <label>Foto de perfil:</label>
      <img
        v-if="imagePreview"
        :src="imagePreview"
        alt="Preview"
        style="max-width: 120px; max-height: 120px; border-radius: 50%"
      />
      <img
        v-else-if="usuario.imageUrl"
        :src="usuario.imageUrl"
        alt="Foto de perfil"
        style="max-width: 120px; max-height: 120px; border-radius: 50%"
      />
      <input type="file" @change="onFileChange" accept="image/*" />
      <button v-if="imageFile" @click.prevent="atualizarImagem">Salvar foto</button>
    </div>
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
img {
  margin-top: 0.5rem;
}
</style>
