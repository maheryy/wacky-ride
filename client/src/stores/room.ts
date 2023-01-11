import { defineStore } from "pinia";
import { ref } from "vue";
import { TMessage } from "../types/message";
import { IRoom, TRoomWithUsersAndMessages } from "../types/room";

export type TStoreRoom = Pick<IRoom, "id"> & Partial<TRoomWithUsersAndMessages>;

type TStoreRooms = {
  [roomId: IRoom["id"]]: TStoreRoom | undefined;
};

export const useRoomStore = defineStore("room", () => {
  const rooms = ref<TStoreRooms>({});

  function setRooms(newRooms: IRoom[]) {
    rooms.value = newRooms.reduce<TStoreRooms>((accumulator, room) => {
      accumulator[room.id] = { messages: [], users: [], ...room };

      return accumulator;
    }, Object.create(null));
  }

  function setRoom(newRoom: TStoreRoom) {
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

  function updateRoom(newRoom: TStoreRoom) {
    rooms.value[newRoom.id] = { ...rooms.value[newRoom.id], ...newRoom };
  }

  function deleteRoom(roomId: IRoom["id"]) {
    delete rooms.value[roomId];
  }

  function addMessage(roomId: IRoom["id"], message: TMessage) {
    rooms.value[roomId]?.messages?.push(message);
  }

  return {
    rooms,
    setRoom,
    setRooms,
    addMessage,
    updateRoom,
    updateRooms,
    deleteRoom,
  };
});

