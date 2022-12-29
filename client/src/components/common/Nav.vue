<template>
  <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
  <RouterLink :to="{ name: 'chat' }" class="nav-link">Chat</RouterLink>
  <RouterLink :to="{ name: 'chatbot' }" class="nav-link">Chatbot</RouterLink>
</template>

<style scoped>
.nav-link {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}
</style>
