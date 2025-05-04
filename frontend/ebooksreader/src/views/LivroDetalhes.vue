<script>
import api from "../services/api.js";
export default {
    props: ['id'], // recebe o id do livro como propriedade no caso vinda da query string
    data() {
        return {
            livro: undefined,
            content: undefined,
            rating: undefined,

            reviews: [], // Inicializa a lista de reviews

            star1: false,
            star2: false,
            star3: false,
            star4: false,
            star5: false,

            usuario: undefined,
        }
    },
    methods: {
        async buscarLivro() {
            const response = await api.buscarLivros(this.id);
            console.log("Livro encontrado:", { response });
            if(response){
                this.livro = response[0];
                this.listarReviews();
            }
        },
        async avaliarLivro() {
            const {livro, content, rating} = this;
            console.log("Tentando adicionar review:", {livro, content, rating})
            if (!livro.id || !rating || rating < 1 || rating > 5) {
                alert('Por favor, insira uma nota válida de 1 a 5.')
                return
            }

            try {
                await api.enviarReview({
                    book_id: livro.id,
                    rating: rating,
                    content: content,
                    user_id: this.usuario.id
                })
                alert('Avaliação enviada! Obrigado.')
            } catch (error) {
                console.error('Erro ao enviar avaliação:', error)
                alert('Erro ao enviar avaliação.')
            }
            
            // Aqui você poderia recarregar a lista para atualizar a média:
            this.buscarLivro()
        },
        async listarReviews() {
            const {livro} = this;
            if (!livro.id) {
                return
            }
            const response = await api.listarReviews(livro.id);
            console.log("Reviews encontrados:", { response });
            if(response){
                this.reviews = response;
            }
        },
        selectStar(nota) {
            this.star1 = nota >= 1;
            this.star2 = nota >= 2;
            this.star3 = nota >= 3;
            this.star4 = nota >= 4;
            this.star5 = nota >= 5;

            this.rating = nota;
        }
    },
    mounted() {
        console.log("LivroDetalhes Montado");
        console.log("ID do livro:", this.id);
        this.buscarLivro();
        const logado = sessionStorage.getItem("logado");
        if(logado) {
            const user = JSON.parse(sessionStorage.getItem("user"));
            if(user) {
                console.log("Montado, usuário: ", {user});
                this.usuario = user;
            }
        }
        
    }
}
</script>

<template>
    <div v-if="livro" class="detalhes-livro">
        <h1>Detalhes do Livro</h1>
        <div class="info-livro" v-if="livro">
            <h2>{{ livro.title }}</h2>
            <p><strong>Autor:</strong> {{ livro.author }}</p>
        </div>
        <div class="descricao">
            <img :src="livro.cover" alt="Capa do livro" />
            <p>{{ livro.description }}</p>

        </div>
        <form class="review-form" @submit.prevent="avaliarLivro">
                    <h3>Faça seu review</h3>

                    <label for="nota">Sua nota</label>
                    <div class="rating-define">
                        <span @click="selectStar(1)" :class="{'fa fa-star': true, 'checked': star1}"></span>
                        <span @click="selectStar(2)" :class="{'fa fa-star': true, 'checked': star2}"></span>
                        <span @click="selectStar(3)" :class="{'fa fa-star': true, 'checked': star3}"></span>
                        <span @click="selectStar(4)" :class="{'fa fa-star': true, 'checked': star4}"></span>
                        <span @click="selectStar(5)" :class="{'fa fa-star': true, 'checked': star5}"></span>
                    </div>

                    <label for="comentario">Seu Comentário</label>
                    <textarea id="comentario" v-model="content"></textarea>
                    <button type="submit">Enviar</button>
                </form>

        <div class="review-lista" v-for="review in reviews" :key="review.id">
            <h4>{{review.user.name}}</h4>
            <div class="rating-detalhes" v-if="review.rating">
                <span>{{ review.rating }}</span>
                <span :class="{'fa fa-star': true, 'checked': review.rating >= 1}"></span>
                <span :class="{'fa fa-star': true, 'checked': review.rating >= 2}"></span>
                <span :class="{'fa fa-star': true, 'checked': review.rating >= 3}"></span>
                <span :class="{'fa fa-star': true, 'checked': review.rating >= 4}"></span>
                <span :class="{'fa fa-star': true, 'checked': review.rating >= 5}"></span>
            </div>
            <p><strong>Comentário:</strong> {{ review.content }}</p>
        </div>
    </div>
</template>

<style>
/* TODO: adicionar estilos a página */
.rating-detalhes {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: .5em;
  :first-child {
    border: 1px solid orange;
    border-radius: 0.5em;
    padding: 0.5em;
    background: rgba(241, 90, 34, 0.05);
  }
}

.rating-define {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: .5em;
    >span {
        &:hover, &:focus-visible {
            cursor: pointer;
        }

        &.checked {
            color: orange;
        }
    }
    
}

.detalhes-livro {
    display: flex;
    flex-direction: column;
    gap: 1em;

    .info-livro {
        display: flex;
        flex-direction: column;
        gap: 1em;
        position:relative;

        .autor {
            padding-inline-start: 1em;
        }
    }
    .descricao {
        display: flex;
        gap: 1em;
        border: 1px solid #165193;
        padding: 1em;
        border-radius: .5em;
        align-items: center;
        background-color: var(--clr-bg-light);
        img {
            padding-inline-end: 1em;
            max-width: 20em;
            border-inline-end: 1px solid #165193;
        }
    }
}

.review-form {
    textarea {
        height: 5em;
    }

    button {
        padding: 0.5em 1em;
        width: 100%
    }
}

.review-lista {
    border: 1px solid #165193;
    border-radius: 0.5em;
    padding: 1em;
    background-color: var(--clr-bg-light);
    display: flex;
    flex-direction: column;
    gap: 1em
}


</style>