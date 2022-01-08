<template>
  <div class="list">
    <input type="text" placeholder="Nova Lista" class="h2" v-model="name" />
    <form class="form" @submit.prevent="addItem">
      <div class="d-flex justify-content-between align-items-center">
        <div class="w-100">
          <input
            class="form-control"
            type="text"
            placeholder="Novo item"
            v-model="newItem"
          />
        </div>
        <div class="ml-2">
          <button class="btn btn-primary btn-sm" type="submit">+</button>
        </div>
      </div>
    </form>

    <ul v-if="list">
      <li v-for="item in list.items" :key="item.name">{{ item.name }}</li>
    </ul>

    <button class="btn btn-primary" @click="saveList">Salvar Lista</button>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";
import { store } from "../store";
import { useRoute } from "vue-router";

export default {
  setup() {
    const loading = ref(true);
    const list = ref({});
    const newItem = ref("");
    const name = ref("");
    const items = ref([]);
    const route = useRoute();

    const addItem = async () => {
      items.value.push(newItem);
    };

    const saveList = async () => {
      try {
        loading.value = true;
        store.user = supabase.auth.user();

        const list = {
          items: JSON.stringify(items),
          user: store.user.id,
          name: "Primeira Lista de Todas 🥰",
        };

        let { error } = await supabase.from("lists").upsert(list);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    };

    const getList = async () => {
      let { data, error, status } = await supabase
        .from("lists")
        .select(`id, items, name, description, user, created_at`)
        .eq("id", route.params.id)
        .single();

      const cleanList = {
        id: data.id,
        name: data.name,
        items: JSON.parse(data.items),
        description: data.description,
        date: data.created_at,
      };
      list.value = cleanList;
    };

    onMounted(() => {
      getList();
    });

    return {
      saveList,
      list,
      newItem,
      name,
      addItem,
      onMounted,
    };
  },
};
</script>

<style></style>
