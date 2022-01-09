<template>
  <div class="list">
    <div class="header d-flex justify-content-between">
      <router-link to="/">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <button class="btn btn-outline-danger" @click="deleteList">Apagar</button>
    </div>

    <input
      type="text"
      placeholder="Nova Lista..."
      class="h3"
      style="border: none"
      v-model="list.name"
    />
  </div>

  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      placeholder="Bolho de murango"
      aria-label="Novo item"
      aria-describedby="button-addon"
      v-model="newItem"
    />
    <button
      class="btn btn-primary"
      style="border-radius: 0px 5px 5px 0px"
      type="button"
      @click="addItem"
      id="button-addon"
    >
      <i class="fas fa-plus" style="color: white"></i>
    </button>
  </div>

  <ul class="list-group" v-if="items">
    <li
      class="list-group-item d-flex justify-content-between"
      v-for="(item, index) in items"
      :key="index"
    >
      - {{ item.name }}
      <div class="amount-control">
        <button
          class="btn btn-secondary btn-sm"
          @click="item.amount > 1 ? item.amount-- : removeItem(index)"
        >
          <i class="fas fa-minus" style="color: white"></i>
        </button>
        <span class="mx-2 lead">
          {{ item.amount }}
        </span>
        <button class="btn btn-secondary btn-sm" @click="item.amount++">
          <i class="fas fa-plus" style="color: white"></i>
        </button>
      </div>
    </li>
  </ul>

  <button class="btn btn-primary mt-3" @click="saveList">Salvar Lista</button>
</template>

<script>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";
import { store } from "../store";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const loading = ref(true);
    const list = ref({});
    const newItem = ref("");
    const items = ref([]);
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;

    const addItem = async () => {
      items.value.push({
        amount: 1,
        name: newItem.value,
        picked: false,
        price: 0,
      });
      newItem.value = "";
    };

    const removeItem = (index) => {
      if (confirm("Deseja remover esse item?")) {
        items.value.splice(index, 1);
      }
    };

    const getList = async () => {
      let { data, error, status } = await supabase
        .from("lists")
        .select(`id, items, name, description, user, created_at`)
        .eq("id", id)
        .single();

      const cleanList = {
        id: data.id,
        name: data.name,
        items: JSON.parse(data.items)._value,
        description: data.description,
        date: data.created_at,
      };
      list.value = cleanList;
      items.value = cleanList.items;
    };

    const saveList = async () => {
      try {
        loading.value = true;
        store.user = supabase.auth.user();

        const new_list = {
          items: JSON.stringify(items),
          user: store.user.id,
          name: list.value.name,
        };

        if (id) {
          await supabase.from("lists").update(new_list).match({ id: id });
        } else {
          await supabase.from("lists").insert(new_list);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    };

    const deleteList = async () => {
      if (confirm("Tem certeza que deseja APAGAR essa lista?")) {
        let { error } = await supabase.from("lists").delete().match({ id: id });
        if (error) throw error;
        router.push("/");
      }
    };

    onMounted(() => {
      if (id) {
        getList();
      }
    });

    return {
      list,
      items,
      newItem,
      addItem,
      removeItem,
      saveList,
      deleteList,
      onMounted,
    };
  },
};
</script>

<style>
.back {
  margin-top: -2rem;
}
</style>
