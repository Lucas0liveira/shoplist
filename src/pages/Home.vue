<template>
  <div class="home">
    <div class="d-flex justify-content-between align-items-center my-3">
      <p class="h4 m-0">Minhas Listas</p>
    </div>

    <ul
      v-if="!loading"
      class="accordion accordion-flush list-group mb-3"
      id="accordionFlushExample"
    >
      <li
        v-for="(list, index) in lists"
        :key="list.id"
        class="nes-balloon nes-pointer"
        :class="index % 2 === 0 ? 'from-left' : 'from-right'"
        @click="$router.push(`/list/${list.id}`)"
      >
        <div class="accordion-header" id="flush-headingOne">
          <span class="d-flex justify-content-between align-items-center">
            {{ list.name }}
            <span
              v-if="list.items"
              class="badge bg-primary rounded-pill text-white"
              >{{ list.items.length }} item(s)</span
            >
          </span>
        </div>
      </li>
    </ul>

    <div v-else class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  <div class="foot">
    <button class="nes-btn block is-success btn-sm" @click="newList">
      Nova lista
    </button>
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

    const getProfile = async () => {
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
    };

    const getLists = async () => {
      let { data, error, status } = await supabase
        .from("lists")
        .select(`id, items, name, description, user, created_at`)
        .eq("user", store.user.id);

      const cleanLists = data.map((list) => ({
        id: list.id,
        name: list.name,
        items: JSON.parse(list.items)._value,
        description: list.description,
        date: list.created_at,
      }));
      lists.value = cleanLists;
    };

    const newList = () => {
      router.push("/list");
    };

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

<style>
.list-group-item {
  cursor: pointer;
}
.foot {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
}
</style>
