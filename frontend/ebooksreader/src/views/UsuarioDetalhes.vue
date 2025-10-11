<script>
// importa a chamada da API
import { atualizarUsuario, buscarImagemUsuario } from '../services/api.js'

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
    buscarImagemUsuario,
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
  <main v-if="usuario" class="perfil-container">
    <h2 class="perfil-titulo">Meu Perfil</h2>

    <!-- Foto -->
    <section class="perfil-card perfil-foto">
      <div class="foto-wrapper relative">
        <img v-if="imagePreview" :src="imagePreview" alt="Preview da foto" class="foto-perfil" />
        <img
          v-else-if="usuario && usuario.id"
          :src="buscarImagemUsuario(usuario.id)"
          alt="Foto de perfil"
          class="foto-perfil"
        />
      </div>

      <!-- Botão de trocar foto -->
      <label class="botao-trocar-foto">
        <i class="fas fa-camera"></i>
        <span>Trocar foto</span>
        <input type="file" @change="onFileChange" accept="image/*" hidden />
      </label>

      <!-- Botão de salvar aparece somente quando há nova imagem -->
      <button v-if="imageFile" class="botao-salvar" @click.prevent="atualizarImagem">Salvar</button>
    </section>

    <!-- Dados -->
    <section class="perfil-card">
      <!-- Nome -->
      <div class="campo-perfil">
        <label class="campo-label">Nome</label>
        <template v-if="!usuario.editarNome">
          <span class="campo-valor">{{ usuario.name }}</span>
          <button class="botao-icone" @click.prevent="usuario.editarNome = true">
            <i class="fas fa-edit"></i>
          </button>
        </template>
        <template v-else>
          <input type="text" v-model="newusername" :placeholder="usuario.name" />
          <div class="acoes-edicao">
            <button class="botao-primario" @click.prevent="atualizarNome">Salvar</button>
            <button class="botao-secundario" @click.prevent="usuario.editarNome = false">
              Cancelar
            </button>
          </div>
        </template>
      </div>

      <!-- Email -->
      <div class="campo-perfil">
        <label class="campo-label">Email</label>
        <template v-if="!usuario.editarEmail">
          <span class="campo-valor">{{ usuario.email }}</span>
          <button class="botao-icone" @click.prevent="usuario.editarEmail = true">
            <i class="fas fa-edit"></i>
          </button>
        </template>
        <template v-else>
          <input type="email" v-model="newemail" :placeholder="usuario.email" />
          <div class="acoes-edicao">
            <button class="botao-primario" @click.prevent="atualizarEmail">Salvar</button>
            <button class="botao-secundario" @click.prevent="usuario.editarEmail = false">
              Cancelar
            </button>
          </div>
        </template>
      </div>

      <!-- Senha -->
      <div class="campo-perfil">
        <label class="campo-label">Senha</label>
        <template v-if="!usuario.editarSenha">
          <span class="campo-valor">********</span>
          <button class="botao-icone" @click.prevent="usuario.editarSenha = true">
            <i class="fas fa-edit"></i>
          </button>
        </template>
        <template v-else>
          <input type="password" v-model="newpassword" placeholder="Nova senha" />
          <div class="acoes-edicao">
            <button class="botao-primario" @click.prevent="atualizarSenha">Salvar</button>
            <button class="botao-secundario" @click.prevent="usuario.editarSenha = false">
              Cancelar
            </button>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Container geral */
.perfil-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

/* Título */
.perfil-titulo {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

/* Card base */
.perfil-card {
  width: 100%;
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Foto de perfil */
.foto-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 0.8rem;
}

.foto-perfil {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.foto-botoes {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

/* Campos */
.campo-perfil {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
}

.campo-label {
  font-weight: 600;
  color: #444;
  font-size: 0.95rem;
}

.campo-valor {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  color: #555;
  font-size: 0.95rem;
}

input {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  font-size: 0.95rem;
}

/* Ícone de edição */
.botao-icone {
  position: absolute;
  right: 10px;
  top: 70%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #777;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}

.botao-icone:hover {
  color: #333;
}

/* Botões */
.botao-primario {
  background: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.45rem 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.botao-primario:hover {
  background: #43a047;
}

.botao-secundario {
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 0.45rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.botao-secundario:hover {
  background: #e0e0e0;
}

.acoes-edicao {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.3rem;
}

.relative {
  position: relative;
}

.icone-trocar {
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icone-trocar:hover {
  opacity: 1;
}

.icone-trocar i {
  color: white;
  font-size: 2rem;
}

.botao-trocar-foto {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  font-weight: 500;
  color: #333;
}

.botao-trocar-foto:hover {
  background-color: #eaeaea;
}

.botao-trocar-foto i {
  font-size: 1rem;
  color: #555;
}

.botao-salvar {
  margin-top: 0.6rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.botao-salvar:hover {
  background: #43a047;
}
</style>
