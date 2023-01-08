import { reactive } from "vue";
import { IConversation } from "./types/conversation";
import { IRoom, TRoomWithUsersAndMessages } from "./types/room";

type TStore = IActions & {
  rooms: {
    [roomId: IRoom["id"]]: TRoomWithUsersAndMessages | undefined;
  };
  conversations: { [roomId: IConversation["id"]]: IConversation };
};

type Setter<T> = (value: T) => void;

interface IActions {
  setConversation: Setter<IConversation>;
  setConversations: Setter<IConversation[]>;
  setRoom: Setter<TRoomWithUsersAndMessages>;
  setRooms: Setter<IRoom[]>;
}

function setRoom(room: TRoomWithUsersAndMessages) {
  store.rooms[room.id] = room;
}

function setRooms(rooms: IRoom[]) {
  store.rooms = rooms.reduce<TStore["rooms"]>((accumulator, room) => {
    accumulator[room.id] = { messages: [], users: [], ...room };

    return accumulator;
  }, Object.create(null));
}

function setConversation(conversation: IConversation) {
  store.conversations[conversation.id] = conversation;
}

function setConversations(conversations: IConversation[]) {
  store.conversations = conversations.reduce<TStore["conversations"]>(
    (accumulator, conversation) => {
      accumulator[conversation.id] = conversation;

      return accumulator;
    },
    Object.create(null)
  );
}

const store: TStore = reactive({
  socket: null,
  rooms: {},
  conversations: [],
  setConversation,
  setConversations,
  setRoom,
  setRooms,
});

export default store as Readonly<TStore>;
