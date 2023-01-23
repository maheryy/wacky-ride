<script setup lang="ts">
import { reactive } from "vue";
import { TStoreRoom } from "../stores";
import { IRoom, TRoomUpdate } from "../types/room";

interface EditableRoomProps {
  initialRoom: TStoreRoom;
  updateRoom: (room: TRoomUpdate) => void;
  deleteRoom: (roomId: IRoom["id"]) => void;
}

const props = defineProps<EditableRoomProps>();
const room = reactive(props.initialRoom);
</script>

<template>
  <div>
    <input type="text" v-model="room.name" />
    <input type="number" v-model="room.limit" />
    <button type="button" @click="updateRoom(room)">Update</button>
    <button type="button" @click="deleteRoom(room.id)">Delete</button>
  </div>
</template>

