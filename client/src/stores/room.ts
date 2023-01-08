import { defineStore } from "pinia";
import { ref } from "vue";
import { TMessage } from "../types/message";
import { IRoom, TRoomWithUsersAndMessages } from "../types/room";

type TStoreRooms = {
  [roomId: IRoom["id"]]: TRoomWithUsersAndMessages | undefined;
};

export const useRoomStore = defineStore("room", () => {
  const rooms = ref<TStoreRooms>({});

  function setRooms(newRooms: IRoom[]) {
    rooms.value = newRooms.reduce<TStoreRooms>((accumulator, room) => {
      accumulator[room.id] = { messages: [], users: [], ...room };

      return accumulator;
    }, Object.create(null));
  }

  function setRoom(newRoom: TRoomWithUsersAndMessages) {
    rooms.value[newRoom.id] = newRoom;
  }

  function addMessage(roomId: IRoom["id"], message: TMessage) {
    rooms.value[roomId]?.messages.push(message);
  }

  return {
    rooms,
    setRoom,
    setRooms,
    addMessage,
  };
});

