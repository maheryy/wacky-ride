import { defineStore } from "pinia";
import { ref } from "vue";
import {
  IConversation,
  TConversationWithMessages,
} from "../types/conversation";
import { TMessage } from "../types/message";

type TStoreConversations = {
  [conversationId: IConversation["id"]]: TConversationWithMessages | undefined;
};

export const useConversationStore = defineStore("conversation", () => {
  const conversations = ref<TStoreConversations>({});

  function setConversation(conversation: TConversationWithMessages) {
    conversations.value[conversation.id] = conversation;
  }

  function setConversations(newConversations: IConversation[]) {
    conversations.value = newConversations.reduce<TStoreConversations>(
      (accumulator, conversation) => {
        accumulator[conversation.id] = { messages: [], ...conversation };

        return accumulator;
      },
      Object.create(null)
    );
  }

  function addMessage(conversationId: IConversation["id"], message: TMessage) {
    conversations.value[conversationId]?.messages.push(message);
  }

  return {
    conversations,
    setConversation,
    setConversations,
    addMessage,
  };
});

