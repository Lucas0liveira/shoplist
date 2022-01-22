<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <router-view />
  </div>
</template>

<script>
import { store } from "./store";
import { supabase } from "./supabase";

export default {
  setup() {
    store.user = supabase.auth.user();
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user;
    });

    return {
      store,
    };
  },
};
</script>
<style scoped>
html,
body,
pre,
code,
kbd,
samp {
  font-family: "Press Start 2P";
}
</style>
