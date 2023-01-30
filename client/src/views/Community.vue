<template>
  <div class="main-container">
    <section id="community">
      <header>
        <h3>Communauté</h3>
      </header>
      <ul>
        <li><RouterLink to="rooms">Salons de discussion</RouterLink></li>
        <li><RouterLink to="conversations">Conversations</RouterLink></li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
#community {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 500px;
  max-height: 500px;
  background-color: white;
  border: 1px solid black;
  color: black;
  width: 400px;

  header {
    display: grid;
    justify-content: center;
    background: black;
    color: white;

    h3 {
      padding: 0.5rem;
    }
  }

  ul {
    display: grid;
    grid-template-rows: repeat(auto-fill, 3rem);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.5rem;
    }

    &::-webkit-scrollbar-track {
      background-color: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #888;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }

    li:nth-child(odd) {
      background-color: #f3f3f3;
    }

    li {
      &:hover {
        background-color: black;
        color: white;
      }

      a {
        display: grid;
        grid-template-columns: 1fr auto;
        text-decoration: none;
        align-items: center;
        height: 100%;
        padding: 0.5rem;
      }
    }
  }
}
</style>

