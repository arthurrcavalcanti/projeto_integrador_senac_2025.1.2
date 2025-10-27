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

// BOOK LISTS
export const adicionarLivroNaLista = async (user_id, book_id, list_name = 'default') => {
  const resultado = await fetch(`${address}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, book_id, list_name }),
  })
  if (!resultado.ok) throw new Error('Erro ao adicionar livro na lista')
  return await resultado.json()
}

export const obterListasDoUsuario = async (user_id) => {
  const resultado = await fetch(`${address}/lists/user/${user_id}`)
  return await resultado.json()
}

export const obterLivrosDaLista = async (user_id, list_name) => {
  const resultado = await fetch(`${address}/lists/user/${user_id}/${encodeURIComponent(list_name)}`)
  return await resultado.json()
}

export const obterTodosLivrosDoUsuario = async (user_id) => {
  const resultado = await fetch(`${address}/lists/user/${user_id}/all`)
  return await resultado.json()
}

export const removerLivroDaLista = async (user_id, book_id, list_name) => {
  const resultado = await fetch(
    `${address}/lists/user/${user_id}/book/${book_id}/${encodeURIComponent(list_name)}`,
    { method: 'DELETE' }
  )
  if (!resultado.ok) throw new Error('Erro ao remover livro da lista')
  return true
}

// BOOK LIKES
export const curtirLivro = async (user_id, book_id) => {
  const resultado = await fetch(`${address}/likes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, book_id }),
  })
  if (!resultado.ok) throw new Error('Erro ao curtir livro')
  return await resultado.json()
}

export const descurtirLivro = async (user_id, book_id) => {
  const resultado = await fetch(`${address}/likes/user/${user_id}/book/${book_id}`, {
    method: 'DELETE',
  })
  if (!resultado.ok) throw new Error('Erro ao descurtir livro')
  return true
}

export const verificarCurtida = async (user_id, book_id) => {
  const resultado = await fetch(`${address}/likes/user/${user_id}/book/${book_id}`)
  return await resultado.json()
}

export const obterLivrosCurtidos = async (user_id) => {
  const resultado = await fetch(`${address}/likes/user/${user_id}`)
  return await resultado.json()
}

export const obterContagemCurtidas = async (book_id) => {
  const resultado = await fetch(`${address}/likes/book/${book_id}/count`)
  return await resultado.json()
}

export const obterSugestoes = async (user_id, limit = 10) => {
  const resultado = await fetch(`${address}/suggestions/user/${user_id}?limit=${limit}`)
  return await resultado.json()
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

  // LISTS
  adicionarLivroNaLista,
  obterListasDoUsuario,
  obterLivrosDaLista,
  obterTodosLivrosDoUsuario,
  removerLivroDaLista,

  // LIKES
  curtirLivro,
  descurtirLivro,
  verificarCurtida,
  obterLivrosCurtidos,
  obterContagemCurtidas,
  obterSugestoes,
}

export default api
