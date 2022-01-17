<template>
  <div v-if="showModal">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Preço do Item</h5>
                <button
                  type="button"
                  class="btn btn-borderless"
                  data-dismiss="modal"
                  aria-label="Close"
                  @click="close"
                >
                  <i class="fas fa-times" style="color: black"></i>
                </button>
              </div>
              <div class="modal-body">
                <input type="float" class="form-control" v-model="price" />
              </div>
              <div class="modal-footer">
                <button @click="salvar" type="button" class="btn btn-primary">
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
      price: 0,
    };
  },
  props: {
    showModal: Boolean,
  },
  methods: {
    salvar() {
      this.$emit("save", this.price);
      this.close();
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
