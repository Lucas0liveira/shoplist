<template>
  <div class="col-6 form-widget">
    <h1 class="header">Bem vindo à Shoppist</h1>
    <p class="description">Sua SmartList High-Stakes na Web!</p>
    <div>
      <button
        type="submit"
        class="btn btn-primary"
        @click="signInWithDiscord"
        :disabled="loading"
      >
        Entrar com Discord
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "../supabase";

export default {
  setup() {
    const loading = ref(false);

    async function signInWithDiscord() {
      loading.value = true;
      const { user, session, error } = await supabase.auth.signIn({
        provider: "discord",
      });
      loading.value = false;
    }

    return {
      loading,
      signInWithDiscord,
    };
  },
};
</script>
