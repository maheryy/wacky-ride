import { defineStore } from "pinia";
import { ref } from "vue";
import {
  IConversation,
  TConversationWithMessages,
} from "../types/conversation";
import { TMessage } from "../types/message";

export type TStoreConversation = IConversation &
  Partial<TConversationWithMessages>;

type TStoreConversations = {
  [conversationId: IConversation["id"]]: TStoreConversation | undefined;
};

export const useConversationStore = defineStore("conversation", () => {
  const conversations = ref<TStoreConversations>({});

  function setConversation(conversation: TStoreConversation) {
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

  function updateConversations(newConversations: TStoreConversation[]) {
    conversations.value = newConversations.reduce<TStoreConversations>(
      (accumulator, conversation) => {
        const existingConversation = accumulator[conversation.id];

        if (existingConversation) {
          accumulator[conversation.id] = {
            ...existingConversation,
            ...conversation,
          };
        } else {
          accumulator[conversation.id] = { messages: [], ...conversation };
        }

        return accumulator;
      },
      conversations.value
    );
  }

  function updateConversation(conversation: TStoreConversation) {
    conversations.value[conversation.id] = {
      ...conversations.value[conversation.id],
      ...conversation,
    };
  }

  function addMessage(conversationId: IConversation["id"], message: TMessage) {
    conversations.value[conversationId]?.messages?.push(message);
  }

  return {
    conversations,
    setConversation,
    setConversations,
    addMessage,
    updateConversation,
    updateConversations,
  };
});

