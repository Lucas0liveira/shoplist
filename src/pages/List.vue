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

  <NewItemInput @insert="({ input }) => addItem(input)" />

  <ul class="list-group" v-if="!loading && editing">
    <li
      class="list-group-item nes-container is-rounded d-flex items-center justify-content-between p-1"
      :class="item.picked ? 'picked' : ''"
      v-for="item in items"
      :key="item.id"
    >
      <div class="form-check">
        <label>
          <input
            class="nes-checkbox"
            type="checkbox"
            v-model="item.picked"
            @change="getPrice(item)"
            id="flexCheckDefault"
          />
          <span>
            {{ item.name }}
          </span>
        </label>
      </div>

      <AmountControl
        @input="(input) => (item.amount = input)"
        @remove="removeItem(item.id)"
        :value="item.amount"
      />
      <PriceModal
        :showModal="showModal"
        @close="closeModal"
        @save="({ price }) => checkoutItem(price)"
      />
    </li>
  </ul>

  <div v-else class="d-flex justify-content-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div class="d-flex justify-content-between mt-3" style="margin-bottom: 6rem">
    <button
      class="nes-btn is-primary flex flex-center items-center mx-1"
      @click="saveList"
    >
      Salvar Lista
    </button>
    <button
      class="nes-btn is-error flex flex-center items-center"
      @click="deleteList"
    >
      <i class="fas fa-trash" style="color: white"></i>
    </button>
  </div>
  <div class="total nes-container">
    <div>R$ {{ total }}</div>
    <progress
      class="nes-progress"
      :class="progressColor"
      :value="progress"
      max="100"
    ></progress>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
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
    const items = ref([]);
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;
    const showModal = ref(false);
    const currentId = ref(null);

    const progress = computed(() => {
      const picked = items.value.filter((item) => item.picked === true).length;
      return (picked / items.value.length) * 100;
    });

    const progressColor = computed(() => {
      if (progress.value <= 25) {
        return "is-error";
      }
      if (progress.value > 75) {
        return "is-success";
      }
      return "is-warning";
    });

    const total = computed(() => {
      let price = 0;
      const prices = items.value
        .filter((item) => item.picked === true)
        .map((item) => item.price * item.amount);
      prices.map((item) => (price += item));
      return price.toFixed(2);
    });

    const addItem = async (newItem) => {
      items.value.push({
        amount: 1,
        name: newItem,
        picked: false,
        price: 0,
      });
    };

    const removeItem = (id) => {
      if (confirm("Deseja remover esse item?")) {
        items.value = items.value.filter((item) => item.id !== id);
      }
    };

    const getList = async () => {
      loading.value = true;
      let { data } = await supabase
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
      items.value = cleanList.items.map((item) => ({
        ...item,
        id: Math.random().toString(16).slice(2),
      }));
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
          total: total.value,
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
        currentId.value = item.id;
        showModal.value = true;
        return;
      }
    };

    const closeModal = () => {
      const i = items.value.findIndex((item) => item.id == currentId.value);
      items.value[i].picked = false;
      currentId.value = null;
      showModal.value = false;
    };

    const checkoutItem = (price) => {
      const i = items.value.findIndex((item) => item.id == currentId.value);
      items.value[i].price = price;
      showModal.value = false;
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
      loading,
      editing,
      buying,
      total,
      showModal,
      progress,
      progressColor,
      addItem,
      removeItem,
      saveList,
      deleteList,
      getPrice,
      checkoutItem,
      closeModal,
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
.total {
  position: fixed;
  bottom: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90px;
  width: 100%;

  background: rgb(255, 255, 255);
  color: #222;
  padding: 0.5rem 0.8rem;
  font-weight: 300;
  font-size: 28px;
}
.picked {
  background-color: #67e7405d;
}
.form-check {
  flex: 1;
}
</style>
