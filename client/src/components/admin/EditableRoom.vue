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
        <input
          v-model="room.name"
          type="text"
          :id="`name-${room.id}`"
          minLength="2"
          maxlength="50"
        />
      </div>
      <div>
        <label :for="`limit-${room.id}`">Limite</label>
        <input
          v-model="room.limit"
          type="number"
          :id="`limit-${room.id}`"
          min="2"
          max="50"
        />
      </div>
    </div>
    <div class="actions">
      <button @click="updateRoom(room)" type="button" class="update">
        Modifier
      </button>
      <button @click="deleteRoom(room.id)" class="delete">Supprimer</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.editable-room {
  display: grid;
  justify-content: center;
  background-color: rgba(95, 142, 253, 0.59);
  gap: 1.5rem;
  padding: 1rem;

  .fields {
    display: grid;
    gap: 1rem;

    input {
      width: 100%;
      background-color: rgba(39, 88, 206, 0.75);
      padding:0.5rem 1rem;
      color: white;
      border-bottom: 1px solid #2758ce;

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
        border: 1px solid #bbbbbb;
        color: #6abb6a;

        &:hover {
          background-color: #6abb6a;
          color: white;
        }
      }
    }

    .delete {
      color: #d94f4f;
      cursor: pointer;
      width: fit-content;
    }
  }
}
</style>

