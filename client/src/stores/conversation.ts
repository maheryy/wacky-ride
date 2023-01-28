import { defineStore } from "pinia";
import { ref } from "vue";
import {
  IConversation,
  TConversationWithMessages,
} from "../types/conversation";
import { TMessage } from "../types/message";
import {IUser} from "../types/user";

export type TStoreConversation = IConversation &
  Partial<TConversationWithMessages>;

type TStoreConversations = {
  [receiverId: IUser["id"]]: TStoreConversation | undefined;
};

export const useConversationStore = defineStore("conversation", () => {
  const conversations = ref<TStoreConversations>({});

  function setConversation(conversation: TStoreConversation) {
    conversations.value[conversation.receiver.id] = conversation;
  }

  function setConversations(newConversations: IConversation[]) {
    conversations.value = newConversations.reduce<TStoreConversations>(
      (accumulator, conversation) => {
        accumulator[conversation.receiver.id] = { messages: [], ...conversation };

        return accumulator;
      },
      Object.create(null)
    );
  }

  function updateConversations(newConversations: TStoreConversation[]) {
    conversations.value = newConversations.reduce<TStoreConversations>(
      (accumulator, conversation) => {
        const existingConversation = accumulator[conversation.receiver.id];

        if (existingConversation) {
          accumulator[conversation.receiver.id] = {
            ...existingConversation,
            ...conversation,
          };
        } else {
          accumulator[conversation.receiver.id] = { messages: [], ...conversation };
        }

        return accumulator;
      },
      conversations.value
    );
  }

  function updateConversation(conversation: TStoreConversation) {
    conversations.value[conversation.receiver.id] = {
      ...conversations.value[conversation.receiver.id],
      ...conversation,
    };
  }

  function addMessage(receiverId: IUser["id"], message: TMessage) {
    conversations.value[receiverId]?.messages?.push(message);
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

