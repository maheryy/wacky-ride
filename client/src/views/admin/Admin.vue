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
  margin: 0 auto;
  gap: 3rem;
  max-width: 1080px;
}
</style>

<style>
.sub_title {
  color: #2758ce;
}
</style>

