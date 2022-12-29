<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const redirectToPath = (path: string) => router.push(path);
const redirectToRoute = (route: string) => router.push({ name: route });
const showAlertQuery = () =>
  alert(
    route.query.test ?? "Type '?test=something' in the url to see the result"
  );
</script>

<template>
  <div>
    <h1>Home</h1>
    <p>Home page</p>
    <div class="playground">
      <p>This is a playground section using vue routing</p>
      <button @click="redirectToPath('/chatbot')">
        Redirect to chatbot as path
      </button>
      <button @click="redirectToRoute('chatbot')">
        Redirect to chatbot as route name
      </button>
      <button @click="showAlertQuery()">Show an URL query string</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
div {
  color: white;
}
</style>
