<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { IChatbotMessage } from "../types/message";
import {
  WorkflowPayload,
  WorkflowAction,
  WorkflowActionTypes,
} from "../types/workflow";
import ChatBotAction from "../components/ChatBotAction.vue";
import ChatBotMessage from "../components/ChatBotMessage.vue";
import Workflow from "../lib/Workflow";

const messages = ref<IChatbotMessage[]>([]);
const action = ref<WorkflowAction>({ type: WorkflowActionTypes.NONE });
const bottom = ref<HTMLElement | null>(null);
let workflow: Workflow;

const registerAnswer = async (data: WorkflowPayload) => {
  if (await workflow.next([data.value])) {
    messages.value.push({
      isBotMessage: false,
      content: data.label.toString(),
    });

    triggerUpdateFromWorkflow();
  }
};

const triggerUpdateFromWorkflow = async () => {
  messages.value.push({
    isBotMessage: true,
    content: workflow.getMessage(),
  });

  await nextTick();

  bottom.value?.scrollIntoView({ block: "end" });

  action.value = {
    type: workflow.getActionType(),
    ...(workflow.hasActionPayload()
      ? { payload: workflow.getActionPayload() }
      : {}),
  };
};

onMounted(async () => {
  workflow = new Workflow();

  if (await workflow.init()) {
    triggerUpdateFromWorkflow();
  }
});
</script>

<template>
  <div class="main-container wacky-tile">
    <section id="chat-bot" class="community">
      <header>
        <RouterLink to="/community" class="back">ᐸ</RouterLink>
        <h3>Wacky bot</h3>
      </header>
      <ul>
        <ChatBotMessage
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
        />
        <div ref="bottom" />
      </ul>
      <ChatBotAction :action="action" :dispatch="registerAnswer" />
    </section>
  </div>
</template>

<style scoped lang="scss">
#chat-bot {
  display: grid;
  grid-template-rows: auto 1fr auto;

  header {
    display: grid;
    align-items: center;
    justify-content: center;
    background: black;
    color: white;
    position: relative;

    .back {
      position: absolute;
      left: 0.5rem;
      font-size: 1rem;
      text-decoration: none;
      color: white;
    }

    h3 {
      padding: 0.5rem;
    }

    button {
      padding: 0.5rem;
      background-color: black;
      color: white;
      border-bottom: 1px solid black;

      &:hover {
        background-color: white;
        color: black;
      }
    }
  }

  ul {
    display: grid;
    grid-auto-rows: min-content;
    gap: 1rem;
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
  }
}
</style>

