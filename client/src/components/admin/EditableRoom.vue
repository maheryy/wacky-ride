<script setup lang="ts">
import { reactive } from "vue";
import { TStoreRoom } from "../../stores";
import { IRoom, TRoomUpdate } from "../../types/room";

interface EditableRoomProps {
  initialRoom: TStoreRoom;
  updateRoom: (room: TRoomUpdate) => void;
  deleteRoom: (roomId: IRoom["id"]) => void;
}

const props = defineProps<EditableRoomProps>();
const room = reactive(props.initialRoom);
</script>

<template>
  <div class="editable-room">
    <div class="fields">
      <div>
        <label :for="`name-${room.id}`">Nom</label>
        <input v-model="room.name" type="text" :id="`name-${room.id}`" />
      </div>
      <div>
        <label :for="`limit-${room.id}`">Limite</label>
        <input v-model="room.limit" type="number" :id="`limit-${room.id}`" />
      </div>
    </div>
    <div class="actions">
      <button @click="updateRoom(room)" type="button" class="update">
        Update
      </button>
      <button @click="deleteRoom(room.id)" class="delete">Delete</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.editable-room {
  display: grid;
  border: 1px solid black;
  gap: 1.5rem;
  padding: 1rem;

  .fields {
    display: grid;
    gap: 1rem;

    input {
      width: 100%;
      padding: 0.5rem 0;
      border-bottom: 1px solid black;

      &:focus {
        outline: none;
      }
    }
  }

  .actions {
    display: grid;
    justify-items: center;
    gap: 0.5rem;

    button {
      padding: 0.5rem;
      background: white;
      width: 100%;

      &.update {
        padding: 0.5rem;
        border: 1px solid black;
        color: green;

        &:hover {
          background-color: green;
          color: white;
        }
      }
    }

    .delete {
      color: red;
      cursor: pointer;
      width: fit-content;
    }
  }
}
</style>

