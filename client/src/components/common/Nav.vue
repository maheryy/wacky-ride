<template>
  <nav class="bg-gray-700">
    <div class="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
      <div class="flex items-center">
        <ul class="flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">
          <li>
            <RouterLink
              :to="{ name: 'home' }"
              class="text-white hover:underline"
            >
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'chat' }"
              class="text-white hover:underline"
            >
              Chat
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'chatbot' }"
              class="text-white hover:underline"
            >
              Chatbot
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
