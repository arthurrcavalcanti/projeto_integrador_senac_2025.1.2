<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Lista de livros</RouterLink>
        <RouterLink to="/add-livros">Adicionar Livros</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

.wrapper {
  nav {
    display: flex;
    padding-block: 1em;
    gap: 1em;
    border-block-end: 1px solid #ccc;
    margin-block-end: 1em;

    a {
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}


</style>
