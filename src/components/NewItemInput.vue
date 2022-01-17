<template>
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      placeholder="Bolho de murango"
      aria-label="Novo item"
      aria-describedby="button-addon"
      v-model="newItem"
      @keyup.enter="addItem"
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
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const newItem = ref("");

    const addItem = () => {
      this.$emit("input", newItem);
    };

    return {
      newItem,
      addItem,
    };
  },
};
</script>

<style></style>
