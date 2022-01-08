<template>
  <div class="home">
    <div class="d-flex justify-content-between align-items-center my-3">
      <p class="h2 m-0">Minhas Listas</p>
      <button class="btn btn-primary btn-sm" @click="newList">
        Nova lista
      </button>
    </div>

    <ul class="list-group" v-if="lists">
      <router-link
        v-for="list in lists"
        :key="list.id"
        class="text-decoration-none"
        :to="`/list/${list.id}`"
      >
        <li
          class="list-group-item d-flex justify-content-between align-items-center mb-1"
        >
          {{ list.name }}
          <span class="badge bg-primary rounded-pill text-white">{{
            list.items.length
          }}</span>
        </li>
      </router-link>
    </ul>

    <div v-else class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "../supabase";
import { store } from "../store";
import { onMounted, ref } from "vue";
import router from "../router";

export default {
  setup() {
    const loading = ref(true);
    const fullname = ref("");
    const lists = ref([]);

    async function getProfile() {
      try {
        loading.value = true;
        store.user = supabase.auth.user();

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`id, username, fullname, avatar_url`)
          .eq("id", store.user.id)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          fullname.value = data.fullname;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function getLists() {
      let { data, error, status } = await supabase
        .from("lists")
        .select(`id, items, name, description, user, created_at`)
        .eq("user", store.user.id);

      const cleanLists = data.map((list) => ({
        id: list.id,
        name: list.name,
        items: JSON.parse(list.items),
        description: list.description,
        date: list.created_at,
      }));
      lists.value = cleanLists;
    }

    function newList() {
      router.push("/list");
    }

    onMounted(() => {
      getProfile();
      getLists();
    });

    return {
      store,
      loading,
      fullname,
      lists,

      newList,
    };
  },
};
</script>

<style></style>
