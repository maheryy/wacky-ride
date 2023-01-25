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
    <div class="bg-img"></div>
    <div class="overlay_bg"></div>
    <section class="min-h-screen flex flex-col align-center justify-center">
      <h1
          class="text-center mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white"
      >
        Bienvenue sur Wacky Ride
      </h1>
      <div class="playground">
        <h2 class="text-2xl text-center font-extrabold text-gray-300 mb-4">
          Le site fait pour les motards
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
    </section>
    <section class="mt-10 mb-10 w-3/4">
      <div class="flex justify-around">
        <div class="max-w-sm text-center">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto autem doloremque dolorum enim eveniet ex facere hic iure laudantium nemo,
          neque obcaecati odio possimus praesentium similique sit soluta voluptas voluptates.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto autem doloremque dolorum enim eveniet ex facere hic iure laudantium nemo,
          neque obcaecati odio possimus praesentium similique sit soluta voluptas voluptates.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto autem doloremque dolorum enim eveniet ex facere hic iure laudantium nemo,
          neque obcaecati odio possimus praesentium similique sit soluta voluptas voluptates.</p>
        </div>
        <div class="relative">
          <div class="overlay_classic"/>
          <div class="home_img_1"/>
        </div>
      </div>
    </section>
    <hr class="w-1/2 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
    <section class="mt-10 w-3/4 mb-10">
      <div class="flex justify-around">
        <div class="relative">
          <div class="overlay_classic"/>
          <div class="home_img_2"/>
        </div>
        <div class="max-w-sm text-center">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto autem doloremque dolorum enim eveniet ex facere hic iure laudantium nemo,
            neque obcaecati odio possimus praesentium similique sit soluta voluptas voluptates.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto autem doloremque dolorum enim eveniet ex facere hic iure laudantium nemo,
            neque obcaecati odio possimus praesentium similique sit soluta voluptas voluptates.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto autem doloremque dolorum enim eveniet ex facere hic iure laudantium nemo,
            neque obcaecati odio possimus praesentium similique sit soluta voluptas voluptates.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .bg-img{
    background-image: url("../assets/bg_img.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .overlay_bg{
    background-color: rgba(28, 27, 27, 0.5);
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .home_img_1{
    background-image: url("../assets/home_img_1.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 455px;
    width: 600px;
  }

  .home_img_2{
    background-image: url("../assets/home_img_2.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 455px;
    width: 600px;
  }

  .overlay_classic{
    background-color: rgba(28, 27, 27, 0.5);
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
</style>
