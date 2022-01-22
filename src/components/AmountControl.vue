<template>
  <div class="amount-control flex items-center">
    <button class="nes-btn is-error items-center btn-sm py-0" @click="decrease">
      <i class="fas fa-minus" style="color: #fff"></i>
    </button>
    <span class="mx-2 lead">
      {{ value }}
    </span>
    <button
      class="nes-btn is-primary items-center btn-sm py-0"
      @click="increase"
    >
      <i class="fas fa-plus" style="color: #fff"></i>
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
  background: transparent !important;
}
</style>
