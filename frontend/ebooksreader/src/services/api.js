const address = 'http://localhost:3000'

export const listarLivros = async () => {
  console.log('Chamando api de listar livros')
  const resultado = await fetch(`${address}/books`)
  return await resultado.json()
}

export const buscarLivros = async (search) => {
  console.log('Chamando api de pesquisar livros')
  const resultado = await fetch(`${address}/books?search=${search}`)
  return await resultado.json()
}

export const adicionarLivro = async (livro) => {
  console.log('Chamando api de adicionar livro')
  const resultado = await fetch(`${address}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(livro),
  })

  console.log(resultado)
}

export const enviarReview = async (livro) => {
  console.log('Chamando api de adicionar livro')
  const resultado = await fetch(`${address}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(livro),
  })

  console.log(resultado)
}

export const listarReviews = async (id) => {
  console.log('Chamando api de listar reviews')
  const resultado = await fetch(`${address}/reviews/book/${id}`)
  return await resultado.json()
}

export const deletarReview = async (id) => {
  console.log('Chamando api de deletar review', id)
  const resp = await fetch(`${address}/reviews/${id}`, {
    method: 'DELETE',
  })
  if (!resp.ok) {
    let msg = 'Erro ao deletar review'
    try {
      const j = await resp.json()
      msg = j.error || msg
    } catch (e) {}
    throw new Error(msg)
  }
  return true
}

export const criarUsuario = async (usuario) => {
  console.log('Chamando api de criar usuario')
  const resultado = await fetch(`${address}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  })

  console.log(resultado)
  return resultado
}

export const loginUsuario = async (usuario) => {
  console.log('Chamando api de login usuario')
  const resultado = await fetch(`${address}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  })

  return resultado
}

export const buscarImagemUsuario = (id) => {
  return `${address}/users/${id}/image`
}

export const buscarUsuario = async (usuario) => {}

export async function atualizarUsuario(data, isMultipart = false) {
  const address = 'http://localhost:3000' // ajuste se necessário
  let options = {}
  if (isMultipart) {
    options = {
      method: 'PUT',
      body: data, // FormData
    }
  } else {
    options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  }
  const response = await fetch(`${address}/users`, options)
  if (!response.ok) throw new Error('Erro ao atualizar usuário')
  return await response.json()
}

const api = {
  // BOOKS
  listarLivros,
  adicionarLivro,
  buscarLivros,

  // REVIEWS
  enviarReview,
  listarReviews,
  deletarReview,

  // USERS
  criarUsuario,
  loginUsuario,
  buscarUsuario,
  buscarImagemUsuario,
}

export default api
