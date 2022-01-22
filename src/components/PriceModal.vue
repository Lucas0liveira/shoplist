<template>
  <div v-show="showModal">
    <section>
      <dialog class="nes-dialog" id="dialog-default">
        <div class="modal-header">
          <h6 class="modal-title">Preço do Item</h6>
          <button
            type="button"
            class="nes-btn btn-borderless flex flex-center items-center"
            data-dismiss="modal"
            aria-label="Close"
            @click="close"
          >
            <i class="fas fa-times" style="color: black"></i>
          </button>
        </div>
        <div class="modal-body">
          <input
            ref="price"
            type="text"
            class="nes-input"
            placeholder="Preço do item"
            v-model="price"
            @keyup.enter="salvar"
            autofocus
          />
        </div>
        <div class="modal-footer">
          <button @click="salvar" type="button" class="nes-btn is-success">
            Salvar
          </button>
        </div>
      </dialog>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      price: null,
    };
  },
  props: {
    showModal: Boolean,
  },
  mounted() {
    this.focusInput();
  },
  methods: {
    salvar() {
      this.$emit("save", { price: this.price });
      this.price = null;
    },
    close() {
      this.$emit("close");
    },
    focusInput() {
      this.$nextTick(() => {
        this.$refs.price.focus();
      });
    },
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
/* */
