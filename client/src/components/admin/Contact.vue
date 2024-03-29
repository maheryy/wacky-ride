<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../stores";
import { IContact, TContactWithUser } from "../../types/contact";
import { TSocket } from "../../types/socket.io";
import { IUser } from "../../types/user";
import { EContactStatus } from "../../types/contact";

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
const router = useRouter();

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
watch(page, (newPage) => adminSocket.emit("contacts", +newPage), {
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

    const { conversation, contact } = data;
    const { status, id } = contact;
    const storeContact = contacts.value[id];

    if (storeContact) {
      storeContact.status = status;
    }

    toast.success("Demande accepté, cliquez ici pour aller à la conversation", {
      onClick: () =>
        router.push({
          name: "conversation",
          params: { conversationId: conversation.id },
        }),
    });
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
  adminSocket.emit("contact:accept", +contactId);
}

function onRefuseContact(contactId: IContact["id"]) {
  adminSocket.emit("contact:refuse", +contactId);
}

function onRefresh() {
  adminSocket.emit("contacts", +page.value);
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
  <section id="contact">
    <h2 class="text-2xl sub_title">Demande de contacts : </h2>
    <div id="header">
      <div id="filter">
        <select v-model="filter.key">
          <option v-for="key in keys" :key="key" :value="key">
            {{ key }}
          </option>
        </select>
        <input v-model="filter.search" type="text" placeholder="élément à filtrer"/>
        <button
            @click="onRefresh"
            id="refresh"
            :disabled="!canRefresh"
            :class="{ highlighted: canRefresh }"
        >
          Rafraîchir
        </button>
      </div>
    </div>
    <hr/>
    <div v-if="sortedContacts" id="contacts">
      <table>
        <thead>
          <tr>
            <th v-for="key in keys" :key="key" @click="sortBy(key)">
              <div class="key">
                <span>{{ key }}</span>
                <span v-show="key === sortKey" id="order">
                  <span v-show="order === 'asc'">↑</span>
                  <span v-show="order === 'desc'">↓</span>
                </span>
              </div>
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
              <div
                id="actions"
                v-if="contact.status === EContactStatus.pending"
              >
                <button @click="onAcceptContact(contact.id)" id="accept">
                  Accepter
                </button>
                <button @click="onRefuseContact(contact.id)" id="refuse">
                  Refuser
                </button>
              </div>
              <div v-else class="treated">
                <span>Demande déjà traitée</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div id="pagination">
        <button @click="onPreviousPage" :disabled="page === 1">
          Précédent
        </button>
        <div id="pages">
          <span>{{ page }}</span>
          <span>/</span>
          <span>{{ maxPage }}</span>
        </div>
        <button @click="onNextPage" :disabled="page === maxPage">
          Suivant
        </button>
      </div>
      <div v-if="count" id="count">
        <span>{{ count }} contacts</span>
      </div>
    </div>
    <div v-else>
      <p>Personne n'a besoin d'aide !</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
#contact {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

#header {
  display: flex;
  gap: 1rem;

  #filter {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    max-width: 600px;

    input,
    select {
      padding: 0.5rem;
    }

    select {
      cursor: pointer;
      padding: 0.5rem;
      background: white;
      color: #5f8efd;
      border-radius: 5px;
      border: 1px solid #5f8efd;
    }

    input {
      border-radius: 5px;
      border: 1px solid #5f8efd;
    }

    #refresh {
      padding: 0.5rem;
      border: 1px solid #2758ce;
      border-radius: 5px;
      background: white;
      &:disabled {
        background: #f3f3f3;
        cursor: not-allowed;
      }
      &.highlighted {
        animation: highlight 1s ease-in-out infinite alternate;
        @keyframes highlight {
          0% {
            background: white;
            color: #2758ce;
          }
          100% {
            background: #2758ce;
            color: white;
          }
        }
      }
    }
  }
}

#contacts {
  display: grid;
  gap: 1rem;

  table {
    thead {
      background-color: #ececec;
    }

    tbody {
      display: grid;
      grid-template-rows: repeat(10, 1fr);

      tr {
        height: 4rem;

        &:nth-child(odd) {
          background: rgba(39, 88, 206, 0.19);
        }
      }
    }

    tr {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }

    th,
    td {
      display: grid;
      align-items: center;
      padding: 0.5rem;
    }

    .key {
      display: grid;
      grid-template-columns: auto 1px;
      justify-content: start;
      gap: 0.5rem;
    }

    th:not(:last-child) {
      cursor: pointer;
    }

    #actions {
      display: grid;
      grid-auto-flow: column;
      gap: 0.5rem;

      button {
        padding: 0.5rem;
        border: 1px solid #bbbbbb;
        background: white;
      }

      #accept {
        color: #6abb6a;

        &:hover {
          background: #6abb6a;
          color: white;
        }
      }

      #refuse {
        color: #d94f4f;

        &:hover {
          background: #d94f4f;
          color: white;
        }
      }
    }
  }

  .treated {
    display: grid;
    justify-content: center;
  }

  #pagination {
    display: grid;
    grid-template-columns: 10rem auto 10rem;
    gap: 1rem;
    justify-content: center;
    align-items: center;

    button {
      padding: 0.5rem;
      border: 1px solid black;
      background: white;

      &:disabled {
        background: #f3f3f3;
        cursor: not-allowed;

        &:hover {
          background: #f3f3f3;
          color: black;
        }
      }

      &:hover {
        background: black;
        color: white;
      }
    }

    #pages {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1rem;
    }
  }

  #count {
    display: grid;
    justify-content: center;
  }
}
</style>

