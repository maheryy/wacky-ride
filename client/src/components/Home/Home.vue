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
  <div class="main-container">
    <h1
      class="text-center mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
    >
      Hello world !
    </h1>
    <div class="playground">
      <h2 class="text-2xl text-center font-extrabold dark:text-white mb-4">
        This is a playground section using vue routing
      </h2>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded"
        @click="redirectToPath('/chatbot')"
      >
        Redirect to chatbot as path
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded"
        @click="redirectToRoute('chatbot')"
      >
        Redirect to chatbot as route name
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded"
        @click="showAlertQuery()"
      >
        Show an URL query string
      </button>
    </div>
  </div>
</template>
