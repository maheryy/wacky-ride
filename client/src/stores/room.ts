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

  function updateRooms(newRooms: IRoom[]) {
    rooms.value = newRooms.reduce<TStoreRooms>((accumulator, room) => {
      const existingRoom = accumulator[room.id];

      if (existingRoom) {
        accumulator[room.id] = { ...existingRoom, ...room };
      } else {
        accumulator[room.id] = { messages: [], users: [], ...room };
      }

      return accumulator;
    }, rooms.value);
  }

  function updateRoom(newRoom: TRoomWithUsersAndMessages) {
    rooms.value[newRoom.id] = { ...rooms.value[newRoom.id], ...newRoom };
  }

  function addMessage(roomId: IRoom["id"], message: TMessage) {
    rooms.value[roomId]?.messages.push(message);
  }

  return {
    rooms,
    setRoom,
    setRooms,
    addMessage,
    updateRoom,
    updateRooms,
  };
});

