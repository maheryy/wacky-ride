<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../stores";
import { IContact, TContactWithUser } from "../../types/contact";
import { TSocket } from "../../types/socket.io";
import { IUser } from "../../types/user";

type TContactSortKey = keyof Pick<IContact, "status">;

type TUserSortKey = keyof Pick<IUser, "username" | "email">;

type TSortKey = TContactSortKey | TUserSortKey;

type TFilter = {
  key: TSortKey;
  search: string;
};

type TOrder = "asc" | "desc";

type TContactRef = {
  [contactId: IContact["id"]]: TContactWithUser;
};

const auth = useAuthStore();
const toast = useToast();
const adminSocket = auth.adminSocket as TSocket;
const contacts = ref<TContactRef>({});
const count = ref(0);
const filter = ref<TFilter>({ key: "email", search: "" });
const sortKey = ref<TSortKey>("status");
const order = ref<TOrder>("asc");
const page = ref(1);
const maxPage = ref(1);
const canRefresh = ref(false);

const filteredContacts = computed(() => {
  if (!contacts.value || !filter.value.key) {
    return null;
  }

  return Object.values(contacts.value).filter((contact) => {
    if (isContactSortKey(filter.value.key)) {
      const value = contact[filter.value.key];

      const regex = new RegExp(filter.value.search, "i");

      return regex.test(value);
    }

    if (isUserSortKey(filter.value.key)) {
      const value = contact.user[filter.value.key];

      const regex = new RegExp(filter.value.search, "i");

      return regex.test(value);
    }
  });
});

const sortedContacts = computed(() => {
  if (!filteredContacts.value) {
    return null;
  }

  return filteredContacts.value.slice().sort((a, b) => {
    if (isContactSortKey(sortKey.value)) {
      const statusOrder = {
        pending: 0,
        accepted: 1,
        refused: 2,
      };

      const comparision =
        statusOrder[a[sortKey.value]] - statusOrder[b[sortKey.value]];

      if (order.value === "asc") {
        return comparision;
      }

      return -comparision;
    }

    if (isUserSortKey(sortKey.value)) {
      const comparision = a.user[sortKey.value].localeCompare(
        b.user[sortKey.value]
      );

      if (order.value === "asc") {
        return comparision;
      }

      return -comparision;
    }

    return 0;
  });
});

// We can't use watchEffect here because emit is synchronous
watch(page, (newPage) => adminSocket.emit("contacts", newPage), {
  immediate: true,
});

onMounted(() => {
  adminSocket.on("contacts", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    const reducedContacts = data.contacts.reduce(
      (accumulator, contact) => ({
        ...accumulator,
        [contact.id]: contact,
      }),
      Object.create(null)
    );

    contacts.value = reducedContacts;
    count.value = data.count;
    maxPage.value = data.maxPage;
    canRefresh.value = false;
  });

  adminSocket.on("contact:accepted", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    const { status, id } = data.contact;

    const contact = contacts.value[id];

    if (contact) {
      contact.status = status;
    }
  });

  adminSocket.on("contact:refused", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    if (!contacts.value) {
      return;
    }

    const { status, id } = data.contact;

    const contact = contacts.value[id];

    if (contact) {
      contact.status = status;
    }
  });

  adminSocket.on("contact:created", ({ errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    canRefresh.value = true;
  });
});

onUnmounted(() => {
  adminSocket.off("contacts");
  adminSocket.off("contact:accepted");
  adminSocket.off("contact:refused");
  adminSocket.off("contact:created");
});

function onAcceptContact(contactId: IContact["id"]) {
  adminSocket.emit("contact:accept", contactId);
}

function onRefuseContact(contactId: IContact["id"]) {
  adminSocket.emit("contact:refuse", contactId);
}

function onRefresh() {
  adminSocket.emit("contacts", page.value);
}

function onPreviousPage() {
  if (page.value > 1) {
    page.value--;
  }
}

function onNextPage() {
  if (page.value < maxPage.value) {
    page.value++;
  }
}

function sortBy(key: string) {
  if (key === sortKey.value) {
    return (order.value = order.value === "asc" ? "desc" : "asc");
  }

  if (isContactSortKey(key) || isUserSortKey(key)) {
    order.value = "asc";
    sortKey.value = key;
  }
}

const contactKeys = ["status"];
const userKeys = ["username", "email"];
const keys = [...userKeys, ...contactKeys];

function isContactSortKey(key: string): key is TContactSortKey {
  return contactKeys.includes(key);
}

function isUserSortKey(key: string): key is TUserSortKey {
  return userKeys.includes(key);
}
</script>

<template>
  <select v-model="filter.key">
    <option v-for="key in keys" :key="key" :value="key">
      {{ key }}
    </option>
  </select>
  <input v-model="filter.search" />
  <button v-if="canRefresh" @click="onRefresh">Refresh</button>
  <table v-if="sortedContacts">
    <thead>
      <tr>
        <th v-for="key in keys" :key="key" @click="sortBy(key)">
          {{ key }}
          <span v-if="key === sortKey">
            <span v-if="order === 'asc'">↑</span>
            <span v-else>↓</span>
          </span>
        </th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="contact in sortedContacts" :key="contact.id">
        <td>{{ contact.user.username }}</td>
        <td>{{ contact.user.email }}</td>
        <td>{{ contact.status }}</td>
        <td>
          <button @click="onAcceptContact(contact.id)">Accept</button>
          <button @click="onRefuseContact(contact.id)">Refuse</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else>
    <p>No contacts</p>
  </div>
  <div>
    <button @click="onPreviousPage">Previous</button>
    <span>{{ page }}</span>
    <span>/</span>
    <span>{{ maxPage }}</span>
    <button @click="onNextPage">Next</button>
  </div>
  <div v-if="count">
    <span>{{ count }} contacts</span>
  </div>
</template>

