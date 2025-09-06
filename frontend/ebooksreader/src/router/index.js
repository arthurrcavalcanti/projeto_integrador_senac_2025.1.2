import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdicionarLivros from '../views/AdicionarLivros.vue'
import LivroDetalhes from '../views/LivroDetalhes.vue'
import UsuarioDetalhes from '../views/UsuarioDetalhes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/user',
      name: 'usuario',
      component: UsuarioDetalhes,
    },
    {
      path: '/add-livros',
      name: 'adicionar-livros',
      component: AdicionarLivros,
    },
    {
      path: '/livro/:id',
      name: 'livro-detalhes',
      component: LivroDetalhes,
      props: true, // passa automaticamento o 'id' como prop
    },
  ],
})

export default router
