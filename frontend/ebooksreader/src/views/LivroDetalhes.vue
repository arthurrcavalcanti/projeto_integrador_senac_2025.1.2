<script>
import api from "../services/api.js";
export default {
    props: ['id'], // recebe o id do livro como propriedade no caso vinda da query string
    data() {
        return {
            livro: undefined
        }
    },
    methods: {
        async buscarLivro() {
            const response = await api.buscarLivros(this.id);
            console.log("Livro encontrado:", { response });
            if(response){
                this.livro = response[0];
            }
        }
    },
    mounted() {
        console.log("LivroDetalhes Montado");
        console.log("ID do livro:", this.id);
        this.buscarLivro();
    }
}
</script>

<template>
    <div>
        <h1>Detalhes do Livro</h1>
        <div v-if="livro">
            <h2>{{ livro.title }}</h2>
            <p><strong>Autor:</strong> {{ livro.author }}</p>
            <p><strong>Descrição:</strong> {{ livro.description }}</p>
            <img :src="livro.cover" alt="Capa do livro" />
        </div>
        <div v-else>
            <p>Carregando...</p>
        </div>
    </div>
</template>

<style>

/* TODO: adicionar estilos a página */

</style>