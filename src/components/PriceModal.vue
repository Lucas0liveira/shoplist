<template>
  <div v-if="showModal">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content nes-container">
              <div class="modal-header">
                <h5 class="modal-title">Preço do Item</h5>
                <button
                  type="button"
                  class="nes-btn is-error flex items-center"
                  data-dismiss="modal"
                  aria-label="Close"
                  @click="close"
                >
                  <i class="fas fa-times" style="color: #fff"></i>
                </button>
              </div>
              <div class="modal-body">
                <input
                  type="float"
                  class="nes-input"
                  v-model="price"
                  @keyup.enter="salvar"
                  autofocus
                />
              </div>
              <div class="modal-footer">
                <button
                  @click="salvar"
                  type="button"
                  class="nes-btn is-success"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
  methods: {
    salvar() {
      this.$emit("save", { price: this.price });
      this.price = null;
    },
    close() {
      this.$emit("close");
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
