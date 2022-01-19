<template>
  <div class="list">
    <Return />
    <input
      type="text"
      placeholder="Nova Lista..."
      class="h3"
      style="border: none"
      v-model="list.name"
    />
  </div>

  <NewItemInput @input="(input) => addItem(input)" />

  <ul class="list-group" v-if="!loading && editing">
    <li
      class="list-group-item d-flex justify-content-between"
      v-for="(item, index) in items"
      :key="index"
    >
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="item.picked"
          @change="getPrice(item)"
          id="flexCheckDefault"
        />
        <label class="form-check-label" for="flexCheckDefault">
          {{ item.name }}
        </label>
      </div>

      <AmountControl
        @input="(input) => (item.amount = input)"
        @remove="removeItem(index)"
        :value="item.amount"
      />
      <PriceModal
        :showModal="showModal"
        @close="showModal = false"
        @save="(price) => checkoutItem(item, price)"
      />
    </li>
  </ul>

  <div v-else class="d-flex justify-content-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div class="d-flex justify-content-between mt-3">
    <button class="btn btn-primary mx-1" @click="saveList">Salvar Lista</button>
    <button class="btn btn-danger" @click="deleteList">
      <i class="fas fa-trash" style="color: white"></i>
    </button>
    <div class="mt-3">Total: R$ {{ total }}</div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";
import { store } from "../store";
import { useRoute, useRouter } from "vue-router";
import Return from "../components/Return.vue";
import AmountControl from "../components/AmountControl.vue";
import NewItemInput from "../components/NewItemInput.vue";
import PriceModal from "../components/PriceModal.vue";

export default {
  setup() {
    const loading = ref(false);
    const editing = ref(true);
    const buying = ref(false);
    const list = ref({});
    const newItem = ref("");
    const items = ref([]);
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;
    const total = ref(0);
    const showModal = ref(false);

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
      loading.value = true;
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
      loading.value = false;
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

    const getPrice = (item) => {
      if (item.picked === true) {
        showModal.value = true;
        return;
      }
      total.value -= item.amount * item.price;
      if (total.value < 0) {
        total.value = 0;
      }
    };

    const checkoutItem = (item, price) => {
      item.price = price;
      total.value += item.amount * item.price;
      saveList();
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
      loading,
      editing,
      buying,
      total,
      showModal,
      addItem,
      removeItem,
      saveList,
      deleteList,
      getPrice,
      checkoutItem,
      onMounted,
    };
  },
  components: {
    Return,
    AmountControl,
    NewItemInput,
    PriceModal,
  },
};
</script>

<style>
.back {
  margin-top: -2rem;
}
</style>
