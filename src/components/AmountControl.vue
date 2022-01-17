<template>
  <div class="amount-control">
    <button class="plus-minus btn btn-outline-primary btn-sm" @click="decrease">
      <i class="fas fa-minus" style="color: #0078da"></i>
    </button>
    <span class="mx-2 lead">
      {{ value }}
    </span>
    <button class="plus-minus btn btn-outline-primary btn-sm" @click="increase">
      <i class="fas fa-plus" style="color: #0078da"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
  },
  methods: {
    increase() {
      const newValue = this.value + 1;

      this.$emit("input", newValue);
    },
    decrease() {
      let newValue;

      if (this.value > 1) {
        newValue = this.value - 1;
        this.$emit("input", newValue);
        return;
      }
      this.$emit("remove");
    },
  },
};
</script>

<style>
.plus-minus,
.plus-minus:hover,
.plus-minus:active {
  border: none !important;
  background-color: #fff !important;
}
</style>
