<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
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

const triggerUpdateFromWorkflow = () => {
  messages.value.push({
    isBotMessage: true,
    content: workflow.getMessage(),
  });

  action.value = {
    type: workflow.getActionType(),
    ...(workflow.hasActionPayload()
      ? { payload: workflow.getActionPayload() }
      : {}),
  };
};

/* Scroll to the bottom for each new message */
watch(
  () => [...messages.value],
  async (newMessages, oldMessages) => {
    await nextTick();
    if (newMessages.length > oldMessages.length) {
      document
        .getElementById("chat-bot-messages")
        ?.scrollIntoView({ block: "end" });
    }
  }
);

onMounted(async () => {
  workflow = new Workflow();
  if (await workflow.init()) {
    triggerUpdateFromWorkflow();
  }
});
</script>

<template>
  <div class="main-container">
    <div id="chat-bot" class="chat-bot">
      <h3>{{ "WackyBot" }}</h3>
      <div class="chat-bot__messages">
        <ul id="chat-bot-messages" class="chat-bot__messages__container">
          <ChatBotMessage
            v-for="(message, index) in messages"
            :key="index"
            :message="message"
          />
        </ul>
      </div>
      <ChatBotAction :action="action" :dispatch="registerAnswer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-bot {
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 500px;
  background-color: #fff;
  border: #999 solid 1px;
  border-radius: 0.3em;
  color: black;
  width: 400px;

  h3 {
    padding: 0.5em;
    background-color: #999;
    color: white;
  }
}

.chat-bot__messages {
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.5em;
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

.chat-bot__input {
  display: flex;
  align-items: center;

  input {
    flex: 1;
    padding: 0.5em;
    border: none;
    border-top: #999 solid 1px;
  }

  button {
    padding: 0.5em;
    border: none;
    border-top: #999 solid 1px;
    border-left: #999 solid 1px;
    background-color: gray;
    cursor: pointer;
  }
}
</style>
