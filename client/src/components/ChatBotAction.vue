<script setup lang="ts">
import {
  WorkflowPayload,
  WorkflowAction,
  WorkflowActionTypes,
} from "../types/workflow";

interface ActionProps {
  action: WorkflowAction;
  dispatch: (data: WorkflowPayload) => void;
}

defineProps<ActionProps>();

const form: any = {};
</script>

<template>
  <div class="chat-bot__action">
    <form @submit.prevent="">
      <div v-if="action.type === WorkflowActionTypes.TEXT">
        <input type="text" name="text" v-model="form.text" required />
        <button
          @click="
            form.text && dispatch({ value: form.text, label: form.text });
            form.text = null;
          "
        >
          Valider
        </button>
      </div>
      <div v-else-if="action.type === WorkflowActionTypes.NUMBER">
        <input type="number" name="number" v-model="form.number" required />
        <button
          @click="
            form.number && dispatch({ value: form.number, label: form.number });
            form.number = null;
          "
        >
          Valider
        </button>
      </div>
      <div v-else-if="action.type === WorkflowActionTypes.DATE">
        <input type="date" name="date" v-model="form.date" required />
        <button
          @click="
            form.date && dispatch({ value: form.date, label: form.date });
            form.date = null;
          "
        >
          Valider
        </button>
      </div>
      <div v-else-if="action.type === WorkflowActionTypes.BOOLEAN">
        <button
          name="boolean"
          @click="dispatch({ value: 'yes', label: 'Oui' })"
        >
          Oui
        </button>
        <button name="boolean" @click="dispatch({ value: 'no', label: 'Non' })">
          Non
        </button>
      </div>
      <div v-else-if="action.type === WorkflowActionTypes.CHOICES">
        <button
          name="choices"
          v-for="option in action.payload"
          @click="dispatch({ value: option.value, label: option.label })"
        >
          {{ option.label }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.chat-bot__action {
  display: grid;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  background-color: black;
  color: white;
}

form {
  div {
    display: grid;
    gap: 0.25rem;

    input {
      padding: 0.5rem;
      color: black;
    }
  }
}
</style>

