const address = 'http://localhost:3000';

export const listarLivros = async () => {
    console.log("Chamando api de listar livros");
    const resultado = await fetch(`${address}/books`);
    return await resultado.json();
}

export const buscarLivros = async (search) => {
    console.log("Chamando api de pesquisar livros");
    const resultado = await fetch(`${address}/books?search=${search}`);
    return await resultado.json();
}


export const adicionarLivro = async (livro) => {
    console.log("Chamando api de adicionar livro");
    const resultado = await fetch(`${address}/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(livro)
    });

    console.log(resultado);
}

const api = {
    listarLivros,
    adicionarLivro,
    buscarLivros
}

export default api;