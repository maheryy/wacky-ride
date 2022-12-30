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
  <form action="">
    <input type="text" name="username" placeholder="Username">
    <input type="text" name="password" placeholder="Password">
    <input type="submit">
  </form>
</template>
