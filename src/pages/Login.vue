<template>
  <div class="col-6 form-widget">
    <h1 class="header">Bem vindo à Shoppist</h1>
    <p class="nes-balloon from-right">Sua lista de compras na web!</p>
    <div class="foot">
      <button
        type="submit"
        class="nes-btn is-primary block flex items-center"
        @click="signInWithDiscord"
        :disabled="loading"
      >
        Entrar com Discord
        <i class="nes-icon snes-logo is-small" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase";

export default {
  setup() {
    const loading = ref(false);
    const router = useRouter();
    const isUserSignedIn = computed(() => Boolean(supabase.auth.user()));

    async function signInWithDiscord() {
      loading.value = true;
      const { user, session, error } = await supabase.auth.signIn({
        provider: "discord",
      });
      loading.value = false;
    }

    onMounted(() => {
      if (isUserSignedIn.value) {
        router.push("/");
      }
    });

    return {
      loading,
      signInWithDiscord,
    };
  },
};
</script>
<style scoped>
.foot {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
}
</style>
