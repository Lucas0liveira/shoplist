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
        console.log("OPA");
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
