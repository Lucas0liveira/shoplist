<template>
  <div class="input-group mb-4">
    <input
      type="text"
      class="form-control nes-input"
      placeholder="Add item"
      aria-label="Novo item"
      aria-describedby="button-addon"
      v-model="newItem"
      @keyup.enter="addItem()"
    />
    <button
      class="nes-btn is-success"
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
export default {
  data() {
    return {
      newItem: "",
    };
  },
  methods: {
    addItem() {
      this.$emit("insert", { input: this.newItem });
      this.newItem = "";
    },
  },
};
</script>

<style></style>
