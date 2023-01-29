<script setup lang="ts">
import Room from "../../components/admin/Room.vue";
import Status from "../../components/admin/Status.vue";
import Contact from "../../components/admin/Contact.vue";
</script>

<template>
  <section id="admin">
    <Status />
    <Contact />
    <Room />
  </section>
</template>

<style scoped lang="scss">
#admin {
  padding: 1rem;
  display: grid;
  grid-auto-flow: row;
  gap: 3rem;
}
</style>

