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

export const buscarUsuario = async (usuario) => {}

export const atualizarUsuario = async (usuario) => {
  console.log('Chamando API de atualizar usuário', { usuario })
  try {
    const response = await fetch(`${address}/users`, {
      method: 'PUT', // PUT é para definir que será um update, podendo usar o mesmo endpoint
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erro ao atualizar usuário')
    }

    const data = await response.json()
    console.log('Usuário atualizado com sucesso', data)
    return data
  } catch (error) {
    console.error('Falha na API de atualizar usuário:', error.message)
    throw error
  }
}

const api = {
  // BOOKS
  listarLivros,
  adicionarLivro,
  buscarLivros,

  // REVIEWS
  enviarReview,
  listarReviews,

  // USERS
  criarUsuario,
  loginUsuario,
  buscarUsuario,
}

export default api
