<template>
  <div class="home">
    <div class="d-flex justify-content-between align-items-center my-3">
      <p class="h2 m-0">Minhas Listas</p>
      <button class="btn btn-primary btn-sm" @click="newList">
        Nova lista
      </button>
    </div>

    <ul
      v-if="!loading"
      class="accordion accordion-flush list-group"
      id="accordionFlushExample"
    >
      <li
        class="accordion-item list-group-item"
        v-for="list in lists"
        :key="list.id"
      >
        <div class="accordion-header" id="flush-headingOne">
          <span
            class="d-flex justify-content-between align-items-center collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseOne"
            aria-expanded="false"
            aria-controls="flush-collapseOne"
          >
            {{ list.name }}
            <span
              v-if="list.items"
              class="badge bg-primary rounded-pill text-white"
              >{{ list.items.length }} item(s)</span
            >
          </span>
        </div>
        <div
          id="flush-collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="flush-headingOne"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body d-flex justify-content-evenly">
            <router-link
              :to="`/list/${list.id}`"
              tag="button"
              class="btn btn-warning block mx-1"
            >
              <i class="fas fa-pencil"></i>
            </router-link>
            <router-link
              :to="`/shop/${list.id}`"
              tag="button"
              class="btn btn-success block mx-1"
            >
              <i class="fas fa-shopping-cart"></i>
            </router-link>
          </div>
        </div>
      </li>
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
    const showModal = ref(false);

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
      showModal,
      newList,
    };
  },
};
</script>

<style>
.list-group-item {
  cursor: pointer;
}
</style>
